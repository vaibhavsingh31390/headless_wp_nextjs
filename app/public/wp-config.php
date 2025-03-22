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
define( 'AUTH_KEY',          'Y:rN%#>8 y2 aKE[!)]}AJ,R*[;{ZFJO6,.+<B Ort#nnP1e&<1R:vhlXgh8%i1+' );
define( 'SECURE_AUTH_KEY',   '-X/dFHW,|CN4Bf]O6~R33$+ZC$b>1Jfm*7)uCtMXZn1~ 9UBNi{j![h@!RL#jE|k' );
define( 'LOGGED_IN_KEY',     '-HztNc$pJgAE}$<,Q/cNfsUnmJY0aZ4xeVu !k=m0[SFKuQ}Jlul@z{A~^{Z^:N)' );
define( 'NONCE_KEY',         'CBheN1rV{s^[lYql.~h2CLt~&Y8Qhs?}:hn7A%b3oS)|`~ILm{7V{S+ MY(SG(r~' );
define( 'AUTH_SALT',         'A#90F6iRz{_(whw|(##iD~d/}2sM2y@@/2jM::D`9nFFeaV:s{dL<Q)s4($c8[=o' );
define( 'SECURE_AUTH_SALT',  'GV$}}aZb%^U3xV^bcVo@vZ>Io35YiLxiXvE+!_q]?s59hrO.S6;o3mcL)8J0-.*k' );
define( 'LOGGED_IN_SALT',    'l:l>=6v;CL9F%[V.PX8+O6]LJ{jMDbR>o0avBy|<F?Ol,@Gan1rqUfQQ,z/z [p+' );
define( 'NONCE_SALT',        'Un.rr*u;Z8uKq_N{&6CEkBYS5gvC2$3^jZ2DcT2d;r8T{_45^oPpxWU{NJ#Y[jrb' );
define( 'WP_CACHE_KEY_SALT', 'b8YU<Ig}/!lxyM4;sO0!}Zkjff9$CC{.cQgdzk5#;7<e%>AQ{25A=qFHG/Bsf7sb' );


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
