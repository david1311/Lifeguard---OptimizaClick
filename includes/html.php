<?php 

/**
 * Overlay form for pointer creation
 * 
 * @return string
 */
function tutopti_overlay_auto() { 
	global $tutopti;

	ob_start();
	?>
		<div class="tutopti-overlay">
			<div class="tutopti-overlay-wrap tutopti-overlay-wrap-left">
				<span class="arrow"></span>
				<div class="tutopti-overlay-content clear">
					<h3 class="header"><span class="tutopti-el-name"></span> <a href="#" class="tutopti-close"><?php _e( 'x', 'tutopti' ); ?></a></h3>
					<form class="tutopti-overlay-form">
						<?php wp_nonce_field( 'tutopti_add_pointer', 'tutopti_nonce' ); ?>
						<input type="hidden" id="action" name="action" value="tutopti_add_pointer" />

						<table>
							<tr>
								<td><label for="tutopti-order"><?php _e( 'Order:', 'tutopti' ); ?></label></td>
								<td>
									<p>
										<select type="text" id="tutopti-order" name="order" >
											<?php $count = 0; ?>
											<?php while ( ++$count <= 25 ) : ?>
												<option value="<?php echo $count ?>"><?php _e( $count, 'tutopti' ); ?></option>
											<?php endwhile; ?>
										</select>
										<img class='tool-tip-icon' src="<?php echo $tutopti->plugin_uri . '/assets/images/question_mark.png' ?>" data-text="The order of this Pointer in relation to all Pointers for this page. This will determine at which point the Pointer will show in the Tour." />
									</p>
								</td>
							</tr>
							<tr>
								<td><label for="tutopti-title"><?php _e( 'Title:', 'tutopti' ); ?></label></td>
								<td><p><input id="tutopti-title" type="text" name="title" /></p></td>
							</tr>
							<tr>
								<td><label for="tutopti-content"><?php _e( 'Content:', 'tutopti' ); ?></label></td>
								<td><p><textarea id="tutopti-content" name="content" rows="5" cols="28" ></textarea></p></td>
							</tr>
							<tr>
								<td><label for="tutopti-edge"><?php _e( 'Edge:', 'tutopti' ); ?></label></td>
								<td>
									<p>
										<select id="tutopti-edge" name="edge">
											<option value="top"><?php _e( 'Top', 'tutopti' ); ?></option>
											<option value="bottom"><?php _e( 'Bottom', 'tutopti' ); ?></option>
											<option value="left"><?php _e( 'Left', 'tutopti' ); ?></option>
											<option value="right"><?php _e( 'Right', 'tutopti' ); ?></option>
										</select>
										<img class='tool-tip-icon' src="<?php echo $tutopti->plugin_uri . '/assets/images/question_mark.png' ?>" data-text="The direction the Pointer will point to. If you choose Left, the Pointer will point to the left." />
									</p>
								</td>
							</tr>
							<tr>
								<td><label for="tutopti-align"><?php _e( 'Align:', 'tutopti' ); ?></label></td>
								<td>
									<p>
										<select id="tutopti-align" name="align">
											<option value="top"><?php _e( 'Top', 'tutopti' ); ?></option>
											<option value="bottom"><?php _e( 'Bottom', 'tutopti' ); ?></option>
											<option value="left"><?php _e( 'Left', 'tutopti' ); ?></option>
											<option value="right"><?php _e( 'Right', 'tutopti' ); ?></option>
											<option value="middle"><?php _e( 'Middle', 'tutopti' ); ?></option>
										</select>
										<img class='tool-tip-icon' src="<?php echo $tutopti->plugin_uri . '/assets/images/question_mark.png' ?>" data-text="The placement of the Arrow of the Pointer relative to its content." />
									</p>
								</td>
							</tr>
							<?php if ( tutopti_is_active() ) : ?>
							<tr>
								<td><label for="tutopti-collection"><?php _e( 'Collection:', 'tutopti' ); ?></label></td>
								<td>
									<p class="clear"><?php tutopti_collections_dropdown(); ?><span class="tutopti-add-collection"></span></p>
									<p class="clear" style="display:none;">
										<input type="text" class="tutopti-new-collection" placeholder="<?php _e( 'Press enter when done...', 'tutopti' ); ?>" />
										<span class="tutopti-cancel-add-collection"></span>
									</p>
								</td>
							</tr>
							<?php endif; ?>
						</table>
						<p class="footer">
							<input class="button-primary" type="submit" value="Create" />
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
 * 
 * @return string
 */
function tutopti_overlay_manual() { 
	global $tutopti;

	ob_start();
	?>
		<div class="tutopti-overlay tutopti-manual">
			<div class="tutopti-overlay-wrap tutopti-overlay-wrap-left">
				<div class="tutopti-overlay-content clear">
					<h3 class="header"> <a href="#" class="tutopti-close"><?php _e( 'x', 'tutopti' ); ?></a></h3>
					<form class="tutopti-overlay-form">
						<?php wp_nonce_field( 'tutopti_add_pointer', 'tutopti_nonce' ); ?>
						<input type="hidden" id="action" name="action" value="tutopti_add_pointer" />

						<table>
							<tr>
								<td><label for="tutopti-order"><?php _e( 'Order:', 'tutopti' ); ?></label></td>
								<td>
									<p>
										<select type="text" id="tutopti-order" name="order" >
											<?php $count = 0; ?>
											<?php while ( ++$count <= 25 ) : ?>
												<option value="<?php echo $count ?>"><?php _e( $count, 'tutopti' ); ?></option>
											<?php endwhile; ?>
										</select>
										<img class='tool-tip-icon' src="<?php echo $tutopti->plugin_uri . '/assets/images/question_mark.png' ?>" data-text="The order of this Pointer in relation to all Pointers for this page. This will determine at which point the Pointer will show in the Tour." />
									</p>
								</td>
							</tr>
							<tr>
								<td><label for="tutopti-selector"><?php _e( 'Selector:', 'tutopti' ); ?></label></td>
								<td><p><input id="tutopti-selector" type="text" name="target" /></p></td>
							</tr>

							<tr>
								<td><label for="tutopti-title"><?php _e( 'Title:', 'tutopti' ); ?></label></td>
								<td><p><input id="tutopti-title" type="text" name="title" /></p></td>
							</tr>
							<tr>
								<td><label for="tutopti-content"><?php _e( 'Content:', 'tutopti' ); ?></label></td>
								<td><p><textarea id="tutopti-content" name="content" rows="5" cols="28" ></textarea></p></td>
							</tr>
							<tr>
								<td><label for="tutopti-edge"><?php _e( 'Edge:', 'tutopti' ); ?></label></td>
								<td>
									<p>
										<select id="tutopti-edge" name="edge">
											<option value="top"><?php _e( 'Top', 'tutopti' ); ?></option>
											<option value="bottom"><?php _e( 'Bottom', 'tutopti' ); ?></option>
											<option value="left"><?php _e( 'Left', 'tutopti' ); ?></option>
											<option value="right"><?php _e( 'Right', 'tutopti' ); ?></option>
										</select>
										<img class='tool-tip-icon' src="<?php echo $tutopti->plugin_uri . '/assets/images/question_mark.png' ?>" data-text="The direction the Pointer will point to. If you choose Left, the Pointer will point to the left." />
									</p>
								</td>
							</tr>
							<tr>
								<td><label for="tutopti-align"><?php _e( 'Align:', 'tutopti' ); ?></label></td>
								<td>
									<p>
										<select id="tutopti-align" name="align">
											<option value="top"><?php _e( 'Top', 'tutopti' ); ?></option>
											<option value="bottom"><?php _e( 'Bottom', 'tutopti' ); ?></option>
											<option value="left"><?php _e( 'Left', 'tutopti' ); ?></option>
											<option value="right"><?php _e( 'Right', 'tutopti' ); ?></option>
											<option value="middle"><?php _e( 'Middle', 'tutopti' ); ?></option>
										</select>
										<img class='tool-tip-icon' src="<?php echo $tutopti->plugin_uri . '/assets/images/question_mark.png' ?>" data-text="The placement of the Arrow of the Pointer relative to its content." />
									</p>
								</td>
							</tr>
							<?php if ( tutopti_is_active() ) : ?>
							<tr>
								<td><label for="tutopti-collection"><?php _e( 'Collection:', 'tutopti' ); ?></label></td>
								<td>
									<p class="clear"><?php tutopti_collections_dropdown(); ?><span class="tutopti-add-collection"></span></p>
									<p class="clear" style="display:none;">
										<input type="text" class="tutopti-new-collection" placeholder="<?php _e( 'Press enter when done...', 'tutopti' ); ?>" />
										<span class="tutopti-cancel-add-collection"></span>
									</p>
								</td>
							</tr>
							<?php endif; ?>
						</table>
						<p class="footer">
							<input class="button-primary" type="submit" value="Create" />
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
function tutopti_splash() {
	ob_start(); ?>
		<div class="tutopti-splash">
			<div class="tutopti-splash-content">
				<p>Press <span class="command"> &nbsp;CTRL+ALT+n&nbsp;  </span> to add a pointer.</p>
				<p><label for="tutopti-dismiss-splash">Do not show this dialog again?&nbsp; </label><input type="checkbox" id="tutopti-dismiss-splash" /></p>
			</div>
			<p class="footer"><input class="button-primary" type="button" value="Okay" /></p>
		</div>
	<?php
	return ob_get_clean();
}

/**
 * Pointer categories dropdown
 * 
 * @return string
 */
function tutopti_collections_dropdown() {
	$args = array(
		'id'                 => 'tutopti-collection',
		'hide_empty'         => 0, 
		'echo'               => 1,
		'hierarchical'       => 1, 
		'name'               => 'collection',
		'taxonomy'           => 'tutopti_collection',
	);

	return wp_dropdown_categories( $args );
}

/**
 * Contextual help content
 *
 * @param boolean $has_pointers
 * @return string
 */
function tutopti_contextual_help_content( $has_pointers = false, $finished = false  ) { 
	ob_start(); ?>
	
	<?php if ( !$has_pointers ) : ?>
	
	<div class="tutopti-help-content">
		<p><?php _e("There are no Pointer Collections for this section. Contact the website administrator to request a custom Pointer Collection if you're in need of assistance and training.", "tutopti"); ?></p>
	</div>

	<?php else : ?>
	
	<div class="tutopti-help-content"> 
		<input type="button" class="tutopti-restart-collection button button-primary button-hero" value="<?php _e( 'Begin Tutorial »', 'tutopti' ) ?>" />
	</div>
	
	<?php endif;
	
	return ob_get_clean();
}