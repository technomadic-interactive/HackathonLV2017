<?php
//Header('application/x-www-form-urlencoded');
if(isset($_POST['llamar'])){
	if($_POST['llamar']=='true'){
        	$f = fopen('flag.txt','wb')or die('error alexa l abrir el archivo');
        	fwrite($f,1);
        	fclose($f);
        	$f = fopen('log.txt','ab')or die('error alexa l abrir el archivo');
        	fwrite($f,date()."----viene del pos alexa true-----"." ".$llamar."\r\n");
        	fclose($f);

        	$output = shell_exec('php make_calls.php');
        	echo "<pre>$output</pre>";
        	exit();
	}
	if($_POST['llamar'] =='false'){
        	$f = fopen('flag.txt','wb')or die('error alexa l abrir el archivo');
        	fwrite($f,0);
        	fclose($f);
        	$f = fopen('log.txt','ab')or die('error alexa l abrir el archivo');
        	fwrite($f,date()."-----viene del post alexa false-----"." ".$llamar."\r\n");
        	fclose($f);

	}
}
else echo "no post llamar";
?>
