<?php
require 'plugin-update-checker.php';
	$className = PucFactory::getLatestClassVersion('PucGitHubChecker');
	$myUpdateChecker = new $className(
		'https://github.com/david1311/Lifeguard---OptimizaClick',
		__FILE__,
		'master'
	);