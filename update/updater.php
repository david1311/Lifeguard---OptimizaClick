<?php
require 'plugin-update-checker.php';
	$className = PucFactory::getLatestClassVersion('PucGitHubChecker');
	$myUpdateChecker = new $className(
		'https://github.com/david1311/Lifeguard---OptimizaClick',
		__FILE__,
		'master'
	);
	$myUpdateChecker->setAccessToken('59d88eb56dce716cf4887943c694e93117acf36e');
