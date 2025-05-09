( function ( $, undefined ) {
	var Field = acf.Field.extend( {
		type: 'checkbox',

		events: {
			'change input': 'onChange',
			'click .acf-add-checkbox': 'onClickAdd',
			'click .acf-checkbox-toggle': 'onClickToggle',
			'click .acf-checkbox-custom': 'onClickCustom',
		},

		$control: function () {
			return this.$( '.acf-checkbox-list' );
		},

		$toggle: function () {
			return this.$( '.acf-checkbox-toggle' );
		},

		$input: function () {
			return this.$( 'input[type="hidden"]' );
		},

		$inputs: function () {
			return this.$( 'input[type="checkbox"]' ).not(
				'.acf-checkbox-toggle'
			);
		},

		getValue: function () {
			var val = [];
			this.$( ':checked' ).each( function () {
				val.push( $( this ).val() );
			} );
			return val.length ? val : false;
		},

		onChange: function ( e, $el ) {
			// Vars.
			var checked = $el.prop( 'checked' );
			var $label = $el.parent( 'label' );
			var $toggle = this.$toggle();

			// Add or remove "selected" class.
			if ( checked ) {
				$label.addClass( 'selected' );
			} else {
				$label.removeClass( 'selected' );
			}

			// Update toggle state if all inputs are checked.
			if ( $toggle.length ) {
				var $inputs = this.$inputs();

				// all checked
				if ( $inputs.not( ':checked' ).length == 0 ) {
					$toggle.prop( 'checked', true );
				} else {
					$toggle.prop( 'checked', false );
				}
			}
		},

		onClickAdd: function ( e, $el ) {
			var html =
				'<li><input class="acf-checkbox-custom" type="checkbox" checked="checked" /><input type="text" name="' +
				this.getInputName() +
				'[]" /></li>';
			$el.parent( 'li' ).before( html );
			$el.parent( 'li' )
				.parent()
				.find( 'input[type="text"]' )
				.last()
				.focus();
		},

		onClickToggle: function ( e, $el ) {
			// Vars.
			var checked = $el.prop( 'checked' );
			var $inputs = this.$( 'input[type="checkbox"]' );
			var $labels = this.$( 'label' );

			// Update "checked" state.
			$inputs.prop( 'checked', checked );

			// Add or remove "selected" class.
			if ( checked ) {
				$labels.addClass( 'selected' );
			} else {
				$labels.removeClass( 'selected' );
			}
		},

		onClickCustom: function ( e, $el ) {
			var checked = $el.prop( 'checked' );
			var $text = $el.next( 'input[type="text"]' );

			// checked
			if ( checked ) {
				$text.prop( 'disabled', false );

				// not checked
			} else {
				$text.prop( 'disabled', true );

				// remove
				if ( $text.val() == '' ) {
					$el.parent( 'li' ).remove();
				}
			}
		},
	} );

	acf.registerFieldType( Field );
} )( jQuery );
