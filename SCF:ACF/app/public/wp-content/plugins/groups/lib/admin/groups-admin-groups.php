<?php
/**
 * groups-admin-groups.php
 *
 * Copyright (c) "kento" Karim Rahimpur www.itthinx.com
 *
 * This code is released under the GNU General Public License.
 * See COPYRIGHT.txt and LICENSE.txt.
 *
 * This code is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * This header and all notices must be kept intact.
 *
 * @author Karim Rahimpur
 * @package groups
 * @since groups 1.0.0
 */

if ( !defined( 'ABSPATH' ) ) {
	exit;
}

// admin defines
define( 'GROUPS_GROUPS_PER_PAGE', 10 );
define( 'GROUPS_ADMIN_GROUPS_NONCE_1', 'groups-nonce-1');
define( 'GROUPS_ADMIN_GROUPS_NONCE_2', 'groups-nonce-2');
define( 'GROUPS_ADMIN_GROUPS_ACTION_NONCE', 'groups-action-nonce');
define( 'GROUPS_ADMIN_GROUPS_FILTER_NONCE', 'groups-filter-nonce' );

require_once GROUPS_CORE_LIB . '/class-groups-pagination.php';
require_once GROUPS_ADMIN_LIB . '/groups-admin-groups-add.php';
require_once GROUPS_ADMIN_LIB . '/groups-admin-groups-edit.php';
require_once GROUPS_ADMIN_LIB . '/groups-admin-groups-remove.php';

/**
 * Manage Groups: table of groups and add, edit, remove actions.
 */
function groups_admin_groups() {

	global $wpdb;

	$output = '';
	$today = date( 'Y-m-d', time() ); // phpcs:ignore WordPress.DateTime.RestrictedFunctions.date_date

	if ( !Groups_User::current_user_can( GROUPS_ADMINISTER_GROUPS ) ) {
		wp_die( esc_html__( 'Access denied.', 'groups' ) );
	}

	//
	// handle actions
	//
	if ( isset( $_POST['action'] ) ) {
		//  handle action submit - do it
		switch( $_POST['action'] ) {
			case 'add' :
				if ( !( $group_id = groups_admin_groups_add_submit() ) ) {
					return groups_admin_groups_add();
				} else {
					$group = Groups_Group::read( $group_id );
					Groups_Admin::add_message( sprintf(
						/* translators: group name */
						__( 'The <em>%s</em> group has been created.', 'groups' ),
						$group->name ? stripslashes( wp_filter_nohtml_kses( $group->name ) ) : ''
					) );
				}
				break;
			case 'edit' :
				if ( !( $group_id = groups_admin_groups_edit_submit() ) ) {
					return groups_admin_groups_edit( $_POST['group-id-field'] ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
				} else {
					$group = Groups_Group::read( $group_id );
					Groups_Admin::add_message( sprintf(
						/* translators: group name */
						__( 'The <em>%s</em> group has been updated.', 'groups' ),
						$group->name ? stripslashes( wp_filter_nohtml_kses( $group->name ) ) : ''
					) );
				}
				break;
			case 'remove' :
				if ( $group_id = groups_admin_groups_remove_submit() ) {
					Groups_Admin::add_message( __( 'The group has been deleted.', 'groups' ) );
				}
				break;
			// bulk actions on groups: add capabilities, remove capabilities, remove groups
			case 'groups-action' :
				if ( wp_verify_nonce( $_POST[GROUPS_ADMIN_GROUPS_ACTION_NONCE], 'admin' ) ) { // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
					$group_ids = isset( $_POST['group_ids'] ) ? $_POST['group_ids'] : null; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
					$bulk_action = null;
					if ( isset( $_POST['bulk'] ) ) {
						$bulk_action = $_POST['bulk-action']; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
					}
					if ( is_array( $group_ids ) && ( $bulk_action !== null ) ) {
						foreach ( $group_ids as $group_id ) {
							switch ( $bulk_action ) {
								case 'add-capability' :
									$capabilities_id = isset( $_POST['capability_id'] ) ? $_POST['capability_id'] : null; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
									if ( $capabilities_id !== null && is_array( $_POST['capability_id'] ) ) {
										foreach ( $capabilities_id as $capability_id ) {
											Groups_Group_Capability::create( array( 'group_id' => $group_id, 'capability_id' => $capability_id ) );
										}
									}
									break;
								case 'remove-capability' :
									$capabilities_id = isset( $_POST['capability_id'] ) ? $_POST['capability_id'] : null; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
									if ( $capabilities_id !== null && is_array( $_POST['capability_id'] ) ) {
										foreach ( $capabilities_id as $capability_id ) {
											Groups_Group_Capability::delete( $group_id, $capability_id );
										}
									}
									break;
								case 'remove-group' :
									$bulk_confirm = isset( $_POST['confirm'] ) ? true : false;
									if ( $bulk_confirm ) {
										groups_admin_groups_bulk_remove_submit();
									} else {
										return groups_admin_groups_bulk_remove();
									}
									break;
							}
						}
					}
				}
				break;
		}
	} else if ( isset ( $_GET['action'] ) ) {
		// handle action request - show form
		switch( $_GET['action'] ) {
			case 'add' :
				return groups_admin_groups_add();
				break;
			case 'edit' :
				if ( isset( $_GET['group_id'] ) ) {
					return groups_admin_groups_edit( $_GET['group_id'] ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
				}
				break;
			case 'remove' :
				if ( isset( $_GET['group_id'] ) ) {
					return groups_admin_groups_remove( $_GET['group_id'] ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
				}
				break;
		}
	}

	//
	// group table
	//
	if (
		isset( $_POST['clear_filters'] ) ||
		isset( $_POST['group_id'] ) ||
		isset( $_POST['group_name'] )
	) {
		if ( !wp_verify_nonce( $_POST[GROUPS_ADMIN_GROUPS_FILTER_NONCE], 'admin' ) ) { // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			wp_die( esc_html__( 'Access denied.', 'groups' ) );
		}
	}

	// filters
	$group_id   = Groups_Options::get_user_option( 'groups_group_id', null );
	$group_name = Groups_Options::get_user_option( 'groups_group_name', null );

	if ( isset( $_POST['clear_filters'] ) ) {
		Groups_Options::delete_user_option( 'groups_group_id' );
		Groups_Options::delete_user_option( 'groups_group_name' );
		$group_id = null;
		$group_name = null;
	} else if ( isset( $_POST['submitted'] ) ) {
		// filter by name
		if ( !empty( $_POST['group_name'] ) ) {
			$group_name = sanitize_text_field( $_POST['group_name'] );
			Groups_Options::update_user_option( 'groups_group_name', $group_name );
		}
		// filter by group id
		if ( !empty( $_POST['group_id'] ) ) {
			$group_id = intval( $_POST['group_id'] );
			Groups_Options::update_user_option( 'groups_group_id', $group_id );
		} else if ( isset( $_POST['group_id'] ) ) { // empty && isset => '' => all
			$group_id = null;
			Groups_Options::delete_user_option( 'groups_group_id' );
		}
	}

	if ( isset( $_POST['row_count'] ) ) {
		if ( !wp_verify_nonce( $_POST[GROUPS_ADMIN_GROUPS_NONCE_1], 'admin' ) ) { // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			wp_die( esc_html__( 'Access denied.', 'groups' ) );
		}
	}

	if ( isset( $_POST['paged'] ) ) {
		if ( !wp_verify_nonce( $_POST[GROUPS_ADMIN_GROUPS_NONCE_2], 'admin' ) ) { // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			wp_die( esc_html__( 'Access denied.', 'groups' ) );
		}
	}

	$current_url = ( is_ssl() ? 'https://' : 'http://' ) . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
	$current_url = remove_query_arg( 'paged', $current_url );
	$current_url = remove_query_arg( 'action', $current_url );
	$current_url = remove_query_arg( 'group_id', $current_url );

	$group_table = _groups_get_tablename( 'group' );

	$output .=
		'<div class="manage-groups wrap">' .
		'<h1>' .
		_x( 'Groups', 'page-title', 'groups' ) .
		sprintf(
			'<a title="%s" class="add page-title-action" href="%s">',
			esc_attr__( 'Click to add a new group', 'groups' ),
			esc_url( $current_url . '&action=add' )
		) .
		sprintf(
			'<img class="icon" alt="%s" src="%s" />',
			esc_attr__( 'Add', 'groups' ),
			esc_url( GROUPS_PLUGIN_URL . 'images/add.png' )
		) .
		sprintf(
			'<span class="label">%s</span>',
			esc_html__( 'New Group', 'groups' )
		) .
		'</a>' .
		'</h1>';

	$output .= Groups_Admin::render_messages();

	$row_count = isset( $_POST['row_count'] ) ? intval( $_POST['row_count'] ) : 0;

	if ($row_count <= 0) {
		$row_count = Groups_Options::get_user_option( 'groups_per_page', GROUPS_GROUPS_PER_PAGE );
	} else {
		Groups_Options::update_user_option('groups_per_page', $row_count );
	}
	$offset = isset( $_GET['offset'] ) ? intval( $_GET['offset'] ) : 0;
	if ( $offset < 0 ) {
		$offset = 0;
	}
	$paged = isset( $_REQUEST['paged'] ) ? intval( $_REQUEST['paged'] ) : 0;
	if ( $paged < 0 ) {
		$paged = 0;
	}

	$orderby = isset( $_GET['orderby'] ) ? $_GET['orderby'] : null; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
	switch ( $orderby ) {
		case 'group_id' :
		case 'name' :
		case 'description' :
			break;
		default:
			$orderby = 'name';
	}

	$order = isset( $_GET['order'] ) ? $_GET['order'] : null; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
	switch ( $order ) {
		case 'asc' :
		case 'ASC' :
			$switch_order = 'DESC';
			break;
		case 'desc' :
		case 'DESC' :
			$switch_order = 'ASC';
			break;
		default:
			$order = 'ASC';
			$switch_order = 'DESC';
	}

	$filters = array( " 1=%d " );
	$filter_params = array( 1 );
	if ( $group_id ) {
		$filters[] = " $group_table.group_id = %d ";
		$filter_params[] = $group_id;
	}
	if ( $group_name ) {
		$filters[] = " $group_table.name LIKE %s ";
		$filter_params[] = '%' . $wpdb->esc_like( $group_name ) . '%';
	}

	if ( !empty( $filters ) ) {
		$filters = " WHERE " . implode( " AND ", $filters );
	} else {
		$filters = '';
	}

	$count_query = $wpdb->prepare( "SELECT COUNT(*) FROM $group_table $filters", $filter_params ); // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders.UnfinishedPrepare
	$count  = $wpdb->get_var( $count_query ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
	if ( $count > $row_count ) {
		$paginate = true;
	} else {
		$paginate = false;
	}
	$pages = ceil ( $count / $row_count );
	if ( $paged > $pages ) {
		$paged = $pages;
	}
	if ( $paged != 0 ) {
		$offset = ( $paged - 1 ) * $row_count;
	}

	$query = $wpdb->prepare(
		// nosemgrep: audit.php.wp.security.sqli.input-in-sinks
		"SELECT * FROM $group_table $filters ORDER BY $orderby $order LIMIT $row_count OFFSET $offset", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders.UnfinishedPrepare
		$filter_params
	);
	// nosemgrep: audit.php.wp.security.sqli.input-in-sinks
	$results = $wpdb->get_results( $query, OBJECT ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared

	$column_display_names = array(
		'group_id'     => __( 'ID', 'groups' ),
		'name'         => __( 'Group', 'groups' ),
		'description'  => __( 'Description', 'groups' ),
		'capabilities' => __( 'Capabilities', 'groups' )
	);

	$output .= '<div class="groups-overview">';

	$output .=
		'<div class="filters">' .
			'<form id="setfilters" action="" method="post">' .
				'<fieldset>' .
				'<legend>' . esc_html__( 'Filters', 'groups' ) . '</legend>' .
				'<label class="group-id-filter">' . esc_html__( 'Group ID', 'groups' ) . ' ' .
				'<input class="group-id-filter" name="group_id" type="text" value="' . esc_attr( $group_id ) . '"/>' .
				'</label>' . ' ' .
				'<label class="group-name-filter">' . esc_html__( 'Group Name', 'groups' ) . ' ' .
				'<input class="group-name-filter" name="group_name" type="text" value="' . esc_attr( stripslashes( $group_name !== null ? $group_name : '' ) ) . '"/>' .
				'</label>' . ' ' .
				wp_nonce_field( 'admin', GROUPS_ADMIN_GROUPS_FILTER_NONCE, true, false ) .
				'<input class="button" type="submit" value="' . esc_attr__( 'Apply', 'groups' ) . '"/>' . ' ' .
				'<input class="button" type="submit" name="clear_filters" value="' . esc_attr__( 'Clear', 'groups' ) . '"/>' .
				'<input type="hidden" value="submitted" name="submitted"/>' .
				'</fieldset>' .
			'</form>' .
		'</div>';

	if ( $paginate ) {
		require_once GROUPS_CORE_LIB . '/class-groups-pagination.php';
		$pagination = new Groups_Pagination( $count, null, $row_count );
		$output .= '<form id="posts-filter" method="post" action="">';
		$output .= '<div>';
		$output .= wp_nonce_field( 'admin', GROUPS_ADMIN_GROUPS_NONCE_2, true, false );
		$output .= '</div>';
		$output .= '<div class="tablenav top">';
		$output .= $pagination->pagination( 'top' );
		$output .= '</div>';
		$output .= '</form>';
	}

	$output .= '<div class="page-options right">';
	$output .= '<form id="setrowcount" action="" method="post">';
	$output .= '<div>';
	$output .= '<label for="row_count">' . esc_html__( 'Results per page', 'groups' ) . '</label>';
	$output .= '<input name="row_count" type="text" size="2" value="' . esc_attr( $row_count ) .'" />';
	$output .= wp_nonce_field( 'admin', GROUPS_ADMIN_GROUPS_NONCE_1, true, false );
	$output .= '<input class="button" type="submit" value="' . esc_attr__( 'Apply', 'groups' ) . '"/>';
	$output .= '</div>';
	$output .= '</form>';
	$output .= '</div>';

	$capability_table = _groups_get_tablename( "capability" );
	$group_capability_table = _groups_get_tablename( "group_capability" );

	// capabilities select
	// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
	$capabilities = $wpdb->get_results( "SELECT * FROM $capability_table ORDER BY capability" );
	$capabilities_select = sprintf(
		'<select class="select capability" name="capability_id[]" multiple="multiple" placeholder="%s" data-placeholder="%s">',
		esc_attr__( 'Capabilities &hellip;', 'groups' ),
		esc_attr__( 'Capabilities &hellip;', 'groups' )
	);
	foreach( $capabilities as $capability ) {
		$capabilities_select .= sprintf(
			'<option value="%s">%s</option>',
			esc_attr( $capability->capability_id ),
			$capability->capability ? stripslashes( wp_filter_nohtml_kses( $capability->capability ) ) : ''
		);
	}
	$capabilities_select .= '</select>';
	$capabilities_select .= Groups_UIE::render_select( '.select.capability' );

	$output .= '<form id="groups-action" method="post" action="">';

	$output .= '<div class="tablenav top">';

	$output .= '<div class="groups-bulk-container">';
	$output .= '<div class="capabilities-select-container">';
	$output .= $capabilities_select;
	$output .= wp_nonce_field( 'admin', GROUPS_ADMIN_GROUPS_ACTION_NONCE, true, false );
	$output .= '</div>';
	$output .= '<select class="bulk-action" name="bulk-action">';
	$output .= '<option selected="selected" value="-1">' . esc_html__( 'Bulk Actions', 'groups' ) . '</option>';
	$output .= '<option value="remove-group">' . esc_html__( 'Remove group', 'groups' ) . '</option>';
	$output .= '<option value="add-capability">' . esc_html__( 'Add capability', 'groups' ) . '</option>';
	$output .= '<option value="remove-capability">' . esc_html__( 'Remove capability', 'groups' ) . '</option>';
	$output .= '</select>';
	$output .= sprintf( '<input class="button" type="submit" name="bulk" value="%s" />', esc_attr__( 'Apply', 'groups' ) );
	$output .= '<input type="hidden" name="action" value="groups-action"/>';
	$output .= '</div>';
	$output .= '</div>';

	$output .= '<table id="" class="wp-list-table widefat fixed" cellspacing="0">';
	$output .= '<thead>';
	$output .= '<tr>';

	$output .= '<th id="cb" class="manage-column column-cb check-column" scope="col"><input type="checkbox"></th>';

	foreach ( $column_display_names as $key => $column_display_name ) {
		$options = array(
			'orderby' => $key,
			'order'   => $switch_order
		);
		$class = $key;
		if ( !in_array( $key, array( 'capabilities' ) ) ) {
			if ( strcmp( $key, $orderby ) == 0 ) {
				$lorder = strtolower( $order );
				$class = "$key manage-column sorted $lorder";
			} else {
				$class = "$key manage-column sortable";
			}
			$column_display_name =
				sprintf(
					'<a href="%s"><span>%s</span><span class="sorting-indicator"></span></a>',
					esc_url( add_query_arg( $options, $current_url ) ),
					esc_html( $column_display_name )
				);
		} else {
			$column_display_name = esc_html( $column_display_name );
		}
		$output .= sprintf(
			'<th scope="col" class="%s">%s</th>',
			esc_attr( $class ),
			$column_display_name
		);
	}

	$output .= '</tr>';
	$output .= '</thead>';
	$output .= '<tbody>';

	if ( count( $results ) > 0 ) {
		for ( $i = 0; $i < count( $results ); $i++ ) {

			$result = $results[$i];

			/**
			 * @var Groups_Group
			 */
			$group = new Groups_Group( $result->group_id );

			// Construct the "edit" URL.
			$edit_url = add_query_arg(
				array(
					'group_id' => intval( $result->group_id ),
					'action' => 'edit',
					'paged' => $paged
				),
				$current_url
			);

			// Construct the "delete" URL.
			$delete_url = add_query_arg(
				array(
					'group_id' => intval( $result->group_id ),
					'action' => 'remove',
					'paged' => $paged
				),
				$current_url
			);

			$users_url = add_query_arg(
				array( 'filter_group_ids[0]' => intval( $result->group_id ) ),
				admin_url( 'users.php' )
			);

			// Construct row actions for this group.
			$row_actions =
				'<div class="row-actions">' .
				'<span class="edit">' .
				'<a href="' . esc_url( $edit_url ) . '">' .
				'<img src="' . GROUPS_PLUGIN_URL . 'images/edit.png"/>' .
				__( 'Edit', 'groups' ) .
				'</a>';
			if ( $result->name !== Groups_Registered::REGISTERED_GROUP_NAME ) {
				$row_actions .=
					' | ' .
					'</span>' .
					'<span class="remove trash">' .
					'<a href="' . esc_url( $delete_url ) . '" class="submitdelete">' .
					'<img src="' . GROUPS_PLUGIN_URL . 'images/remove.png"/>' .
					__( 'Remove', 'groups' ) .
					'</a>' .
					'</span>';
				}
			$row_actions .= '</div>'; // .row-actions

			$output .= '<tr class="' . ( $i % 2 == 0 ? 'even' : 'odd' ) . '">';

			$output .= '<th class="check-column">';
			$output .= '<input type="checkbox" value="' . esc_attr( $result->group_id ) . '" name="group_ids[]"/>';
			$output .= '</th>';

			$output .= '<td class="group-id">';
			$output .= $result->group_id;
			$output .= '</td>';
			$output .= '<td class="group-name">';
			$output .= sprintf(
				'<a href="%s">%s</a>',
				esc_url( $edit_url ),
				$result->name ? stripslashes( wp_filter_nohtml_kses( $result->name ) ) : ''
			);
			$output .= ' ';
			$user_ids = $group->get_user_ids();
			$user_count = is_array( $user_ids ) ? count( $user_ids ) : 0; // guard against null when there are no users
			$output .= sprintf(
				'(<a href="%s">%s</a>)',
				esc_url( $users_url ),
				$user_count
			);
			$output .= $row_actions;
			$output .= '</td>';
			$output .= '<td class="group-description">';
			$output .= $result->description ? stripslashes( wp_filter_nohtml_kses( $result->description ) ) : '';
			$output .= '</td>';

			$output .= '<td class="capabilities">';

			$group_capabilities = $group->get_capabilities();
			$group_capabilities_deep = $group->get_capabilities_deep();
			usort( $group_capabilities_deep, array( 'Groups_Utility', 'cmp' ) );

			if ( count( $group_capabilities_deep ) > 0 ) {
				$output .= '<ul>';
				foreach ( $group_capabilities_deep as $group_capability ) {
					$output .= '<li>';
					$class = '';
					if ( empty( $group_capabilities ) || !in_array( $group_capability, $group_capabilities ) ) {
						$class = 'inherited';
					}
					$output .= sprintf( '<span class="%s">', $class );
					$output .= stripslashes( wp_filter_nohtml_kses( $group_capability->get_capability() ) );
					$output .= '</span>';
					$output .= '</li>';
				}
				$output .= '</ul>';
			} else {
				$output .= esc_html__( 'This group has no capabilities.', 'groups' );
			}
			$output .= '</td>';

			$output .= '</tr>';
		}
	} else {
		$output .= '<tr><td colspan="4">' . esc_html__( 'There are no results.', 'groups' ) . '</td></tr>';
	}

	$output .= '</tbody>';
	$output .= '</table>';

	$output .= Groups_UIE::render_add_titles( '.groups-overview table td' );

	$output .= '</form>'; // #groups-action

	if ( $paginate ) {
		require_once GROUPS_CORE_LIB . '/class-groups-pagination.php';
		$pagination = new Groups_Pagination($count, null, $row_count);
		$output .= '<div class="tablenav bottom">';
		$output .= $pagination->pagination( 'bottom' );
		$output .= '</div>';
	}

	$output .= '</div>'; // .groups-overview
	$output .= '</div>'; // .manage-groups

	echo $output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
} // function groups_admin_groups()
