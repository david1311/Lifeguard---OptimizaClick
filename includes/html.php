<?php 
function lifeguard_overlay_auto() { 
	global $lifeguard;
	ob_start();
	?>
		<div class="lifeguard-overlay">
			<div class="lifeguard-overlay-wrap lifeguard-overlay-wrap-left">
				<span class="arrow"></span>
				<div class="lifeguard-overlay-content clear">
					<h3 class="header"><span class="lifeguard-el-name"></span> <a href="#" class="lifeguard-close"><?php _e( 'x', 'lifeguard' ); ?></a></h3>
					<form class="lifeguard-overlay-form">
						<?php wp_nonce_field( 'lifeguard_add_pointer', 'lifeguard_nonce' ); ?>
						<input type="hidden" id="action" name="action" value="lifeguard_add_pointer" />

						<table>
							<tr>
								<td><label for="lifeguard-order"><?php _e( 'Ordenación:', 'lifeguard' ); ?></label></td>
								<td>
									<p>
										<select type="text" id="lifeguard-order" name="order" >
											<?php $count = 0; ?>
											<?php while ( ++$count <= 25 ) : ?>
												<option value="<?php echo $count ?>"><?php _e( $count, 'lifeguard' ); ?></option>
											<?php endwhile; ?>
										</select>
										<img class='tool-tip-icon' src="<?php echo $lifeguard->plugin_uri . '/assets/images/question_mark.png' ?>" data-text="Orden, si no introduces ninguno automaticamente va al siguiente." />
									</p>
								</td>
							</tr>
							<tr>
								<td><label for="lifeguard-title"><?php _e( 'Titulo:', 'lifeguard' ); ?></label></td>
								<td><p><input id="lifeguard-title" type="text" name="title" /></p></td>
							</tr>
							<tr>
								<td><label for="lifeguard-content"><?php _e( 'Contenido:', 'lifeguard' ); ?></label></td>
								<td><p><textarea id="lifeguard-content" name="content" rows="5" cols="28" ></textarea></p></td>
							</tr>
							<tr>
								<td><label for="lifeguard-edge"><?php _e( 'Borde:', 'lifeguard' ); ?></label></td>
								<td>
									<p>
										<select id="lifeguard-edge" name="edge">
											<option value="top"><?php _e( 'Arriba', 'lifeguard' ); ?></option>
											<option value="bottom"><?php _e( 'Abajo', 'lifeguard' ); ?></option>
											<option value="left"><?php _e( 'Izquierda', 'lifeguard' ); ?></option>
											<option value="right"><?php _e( 'Derecha', 'lifeguard' ); ?></option>
										</select>
										<img class='tool-tip-icon' src="<?php echo $lifeguard->plugin_uri . '/assets/images/question_mark.png' ?>" data-text="Esta es la direccion del puntero, si eliges la izquierda, este apuntara a la izquierda." />
									</p>
								</td>
							</tr>
							<tr>
								<td><label for="lifeguard-align"><?php _e( 'Alineacion:', 'lifeguard' ); ?></label></td>
								<td>
									<p>
										<select id="lifeguard-align" name="align">
											<option value="top"><?php _e( 'Arriba', 'lifeguard' ); ?></option>
											<option value="bottom"><?php _e( 'Abajo', 'lifeguard' ); ?></option>
											<option value="left"><?php _e( 'Izquierda', 'lifeguard' ); ?></option>
											<option value="right"><?php _e( 'Derecha', 'lifeguard' ); ?></option>
											<option value="middle"><?php _e( 'Centro', 'lifeguard' ); ?></option>
										</select>
										<img class='tool-tip-icon' src="<?php echo $lifeguard->plugin_uri . '/assets/images/question_mark.png' ?>" data-text="La flecha apuntara relativamente al contenido marcado" />
									</p>
								</td>
							<?php if ( lifeguard_is_active() ) : ?>
							<tr>
								<td><label for="lifeguard-collection"><?php _e( 'Categoria:', 'lifeguard' ); ?></label></td>
								<td>
									<p class="clear"><?php lifeguard_contentss_dropdown(); ?><span class="lifeguard-add-collection"></span></p>
									<p class="clear" style="display:none;">
										<input type="text" class="lifeguard-new-collection" placeholder="<?php _e( 'Introduce bien los datos...', 'lifeguard' ); ?>" />
										<span class="lifeguard-cancel-add-collection"></span>
									</p>
								</td>
							</tr>
							<?php endif; ?>
						</table>
						<p class="footer">
							<input class="button-primary" type="submit" value="Crear" />
						</p>
					</form>
				</div>
			</div>
		</div>
	<?php
	return ob_get_clean();
}

/**
 * Overlay form for pointer creation
 */
function lifeguard_overlay_manual() { 
	global $lifeguard;

	ob_start();
	?>
		<div class="lifeguard-overlay lifeguard-manual">
			<div class="lifeguard-overlay-wrap lifeguard-overlay-wrap-left">
				<div class="lifeguard-overlay-content clear">
					<h3 class="header"> <a href="#" class="lifeguard-close"><?php _e( 'x', 'lifeguard' ); ?></a></h3>
					<form class="lifeguard-overlay-form">
						<?php wp_nonce_field( 'lifeguard_add_pointer', 'lifeguard_nonce' ); ?>
						<input type="hidden" id="action" name="action" value="lifeguard_add_pointer" />

						<table>
							<tr>
								<td><label for="lifeguard-order"><?php _e( 'Order:', 'lifeguard' ); ?></label></td>
								<td>
									<p>
										<select type="text" id="lifeguard-order" name="order" >
											<?php $count = 0; ?>
											<?php while ( ++$count <= 25 ) : ?>
												<option value="<?php echo $count ?>"><?php _e( $count, 'lifeguard' ); ?></option>
											<?php endwhile; ?>
										</select>
										<img class='tool-tip-icon' src="<?php echo $lifeguard->plugin_uri . '/assets/images/question_mark.png' ?>" data-text="The order of this Pointer in relation to all Pointers for this page. This will determine at which point the Pointer will show in the Tour." />
									</p>
								</td>
							</tr>
							<tr>
								<td><label for="lifeguard-selector"><?php _e( 'Selector:', 'lifeguard' ); ?></label></td>
								<td><p><input id="lifeguard-selector" type="text" name="target" /></p></td>
							</tr>

							<tr>
								<td><label for="lifeguard-title"><?php _e( 'Title:', 'lifeguard' ); ?></label></td>
								<td><p><input id="lifeguard-title" type="text" name="title" /></p></td>
							</tr>
							<tr>
								<td><label for="lifeguard-content"><?php _e( 'Content:', 'lifeguard' ); ?></label></td>
								<td><p><textarea id="lifeguard-content" name="content" rows="5" cols="28" ></textarea></p></td>
							</tr>
							<tr>
								<td><label for="lifeguard-edge"><?php _e( 'Edge:', 'lifeguard' ); ?></label></td>
								<td>
									<p>
										<select id="lifeguard-edge" name="edge">
											<option value="top"><?php _e( 'Top', 'lifeguard' ); ?></option>
											<option value="bottom"><?php _e( 'Bottom', 'lifeguard' ); ?></option>
											<option value="left"><?php _e( 'Left', 'lifeguard' ); ?></option>
											<option value="right"><?php _e( 'Right', 'lifeguard' ); ?></option>
										</select>
										<img class='tool-tip-icon' src="<?php echo $lifeguard->plugin_uri . '/assets/images/question_mark.png' ?>" data-text="The direction the Pointer will point to. If you choose Left, the Pointer will point to the left." />
									</p>
								</td>
							</tr>
							<tr>
								<td><label for="lifeguard-align"><?php _e( 'Align:', 'lifeguard' ); ?></label></td>
								<td>
									<p>
										<select id="lifeguard-align" name="align">
											<option value="top"><?php _e( 'Top', 'lifeguard' ); ?></option>
											<option value="bottom"><?php _e( 'Bottom', 'lifeguard' ); ?></option>
											<option value="left"><?php _e( 'Left', 'lifeguard' ); ?></option>
											<option value="right"><?php _e( 'Right', 'lifeguard' ); ?></option>
											<option value="middle"><?php _e( 'Middle', 'lifeguard' ); ?></option>
										</select>
										<img class='tool-tip-icon' src="<?php echo $lifeguard->plugin_uri . '/assets/images/question_mark.png' ?>" data-text="The placement of the Arrow of the Pointer relative to its content." />
									</p>
								</td>
							</tr>
							<?php if ( lifeguard_is_active() ) : ?>
							<tr>
								<td><label for="lifeguard-collection"><?php _e( 'Collection:', 'lifeguard' ); ?></label></td>
								<td>
									<p class="clear"><?php lifeguard_contentss_dropdown(); ?><span class="lifeguard-add-collection"></span></p>
									<p class="clear" style="display:none;">
										<input type="text" class="lifeguard-new-collection" placeholder="<?php _e( 'Presiona cuando estes listo...', 'lifeguard' ); ?>" />
										<span class="lifeguard-cancel-add-collection"></span>
									</p>
								</td>
							</tr>
							<?php endif; ?>
						</table>
						<p class="footer">
							<input class="button-primary" type="submit" value="Crear" />
						</p>
					</form>
				</div>
			</div>
		</div>
	<?php
	return ob_get_clean();
}

/**
 * Manual mode splash
 */
function lifeguard_splash() {
	ob_start(); ?>
		<div class="lifeguard-splash">
			<div class="lifeguard-splash-content">
				<p>Press <span class="command"> &nbsp;CTRL+ALT+n&nbsp;  </span> para añadir un punto fijo.</p>
				<p><label for="lifeguard-dismiss-splash">No volver a mostrar formulario. </label><input type="checkbox" id="lifeguard-dismiss-splash" /></p>
			</div>
			<p class="footer"><input class="button-primary" type="button" value="Okay" /></p>
		</div>
	<?php
	return ob_get_clean();
}

/**
 * Pointer categories dropdown
 */
function lifeguard_contentss_dropdown() {
	$args = array(
		'id'                 => 'lifeguard-collection',
		'hide_empty'         => 0, 
		'echo'               => 1,
		'hierarchical'       => 1, 
		'name'               => 'collection',
		'taxonomy'           => 'lifeguard_contents',
	);

	return wp_dropdown_categories( $args );
}

/**
 * Contextual help content
 */
function lifeguard_contextual_help_content( $has_pointers = false, $finished = false  ) { 
	ob_start(); ?>
	
	<?php if ( !$has_pointers ) : ?>
	
	<div class="lifeguard-help-content">
		<p><?php _e("There are no Pointer Collections for this section. Contact the website administrator to request a custom Pointer Collection if you're in need of assistance and training.", "lifeguard"); ?></p>
	</div>

	<?php else : ?>
	
	<div class="lifeguard-help-content"> 
		<input type="button" class="lifeguard-restart-collection button button-primary button-hero" value="<?php _e( 'Comenzar tutorial', 'lifeguard' ) ?>" />
	</div>
	
	<?php endif;
	
	return ob_get_clean();
}