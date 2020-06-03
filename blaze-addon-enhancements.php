<?php
/*
  Plugin Name: Blaze - Product Addons Enhancement
  Description: Adds enhancement to product addons on the front-end
  Author: Blaze Online
  Author URI: https://blaze.online
  Version: 1.0.0
 */
if (!defined('ABSPATH')) {
  exit; // Exit if accessed directly
}

function blz_pae_enqueue_scripts() {
  if(is_product()) {
    wp_enqueue_script( 'tingle-js', plugin_dir_url(__FILE__) . 'assets/js/tingle.js', array('jquery') );
    wp_enqueue_script( 'addon-js', plugin_dir_url(__FILE__) . 'assets/js/addon.js', array('jquery') );
    wp_enqueue_style( 'tingle-css', plugin_dir_url(__FILE__) . 'assets/css/tingle.css', null, '1.3.8' );
    wp_enqueue_style( 'addon-plugin-css', plugin_dir_url(__FILE__) . 'assets/css/addon.css', null, '1.3.9' );
  }
}
add_action( 'wp_enqueue_scripts', 'blz_pae_enqueue_scripts' );

add_action('woocommerce_add_to_cart', 'blz_pae_add_to_cart');
function blz_pae_add_to_cart() {
    global $woocommerce;
    $cart = WC()->cart->cart_contents;
    foreach ( $cart as $cart_item_key => $values ) {
      $values['addons'] = array_filter($values['addons'], function($addon) {
        if (in_array(strtolower($addon['name']), ["upgrade your wine", "gift styling"])) return true;
        
        return $addon['value'] > 0;
      });
      WC()->cart->cart_contents[$cart_item_key] = $values;
    }
    WC()->cart->set_session();
}
