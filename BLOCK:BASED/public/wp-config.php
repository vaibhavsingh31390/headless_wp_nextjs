<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'local' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', 'root' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',          '%TA0=Xh=fpdJb7H*I8Q3n^7U,e!ZFF{r8Yh0|{mB?Jxxa7ZN@Z3lHf8_`C[nYF42' );
define( 'SECURE_AUTH_KEY',   'G8#(zd)U<BRb>Jz)aqL8ng9v)H /1k[&TpKw,(Q-&CK<ApMI!<*t&QMD;Fu`pfm`' );
define( 'LOGGED_IN_KEY',     'ILIccdWkg{8H 0ddK[wjdjplTL@GD$a?qfn4_$=Fg2r8uSx{N<@n5.[_SU1?Tpa4' );
define( 'NONCE_KEY',         'S:w8Lo<a[k].[Doh34!*g>Wkl{8R+MR4(91JzYTlxpw*5&PQEi>#-*nkyp_$h$+{' );
define( 'AUTH_SALT',         '3~tcU-Pc:nL{gVEOq=;<d&yL-W>-qB?9d{t~?N~F8.~5afy-lH2?`3NbRpUgpK0}' );
define( 'SECURE_AUTH_SALT',  'a=%3wb|82/yKLX&T W%{:<,6j:Lm/Gn#8N<EyasX&;A~PlY,+sK9-taGpGXg`W*A' );
define( 'LOGGED_IN_SALT',    'JP=kT6:gv8V`Vb+>.{wlDqn+~<V5D}P8`_g7VMRZM{+EDi;44d{W{.D$,kTRC-P`' );
define( 'NONCE_SALT',        'lv&}]t{yOyt!QmQ:,`G62R&;(uX^r,v=;-.gUlNmEN:3Xy>?By[w1j{4PP->the~' );
define( 'WP_CACHE_KEY_SALT', ')*,z^XH6z1s^w50kORp+)xuPxBQ;R &xFSI7>_^>rc-#G(f_bqZqkaQ 1Fqv[`Uy' );


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';


/* Add any custom values between this line and the "stop editing" line. */



/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

define( 'WP_ENVIRONMENT_TYPE', 'local' );
/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
