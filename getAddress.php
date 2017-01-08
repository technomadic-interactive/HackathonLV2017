<?php
require('plivo.php');
//include('receive.php');
//Header('Content-type: text/xml');
Header('application/x-www-form-urlencoded');
$arduino=NULL;
//-------------------------------------------------------------
if($_POST['id']=='arduino'){
	$arduino = 'true';
}
/*if(($_POST['token']=='01072017')AND($_POST['llamar']==true)){
	//$llamar=$_POST['llamar'];
	$llamar=true;
	$f = fopen('log.txt','ab')or die('error alexa l abrir el archivo');
        fwrite($f,'viene del post token----  '.$llamar.' '.$arduino.'\n');
        fclose($f);
	echo '######viene post #######';
  }
else $llamar=false;
*/	
if($_GET){
	$lat = $_GET['lat'];
	$long = $_GET['long'];
	echo "viene post";
}
else{
	$lat="36.1864831";
	$long = "-115.2272638";
	echo "no viene el get";
}
$url = "http://maps.googleapis.com/maps/api/geocode/json?latlng=$lat,$long&sensor=false";
//-----------------------Escribe el xml para convertir a texto---------
$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_HEADER, false);
curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_ENCODING, "");
$curlData = curl_exec($curl);
curl_close($curl);

$address = json_decode($curlData,true);

$myAddress = $address['results'][0]['formatted_address'];

$r = new Response();

# Add Speak XML Tag with English text
$body1 = 'I am the  <emphasis level="moderate">Personal health care<break time="20ms"/>  assistant</emphasis><break time="20ms"/>  of Hanibal.  There  <emphasis level="moderate">is a medical emergency</emphasis><break time="30ms"/>  at <break time="100ms"/>'.$myAddress;
$params1 = array(
        'language' => "en-US", # Language used to read out the text.m
        'voice' => "WOMAN" # The tone to be used for reading out the text.
);
$r->addSpeak($body1,$params1);
$f = fopen("answer.xml","wb") or die('error al abrir el archivo');
fwrite($f, $r->toXML());
fclose($f);
echo($r->toXML());
//------------------------------------------------------------------------
//-------------lee archivo flag y setea la bandera true o false----------
function fllama(){
	$f = fopen('flag.txt','rb')or die('error al leer el archivo');
	$read=fread($f, 1024);
	if($read==0){
		//$llamar=='false';
		return false;
	}
	else if($read==1)return true;

	else return false;
}

/*function delayCommand($callback, $delayTime) {
        sleep($delayTime);
        $callback();
}*/

//--------------------------------------------------------------------
//----------------------------viene post Arduino---------------------
if($arduino=='true'){
	echo "durmiendo 10segundos";
	//delayCommand($fllama, 30) {
//}
	sleep(40);
	$f = fopen('log.txt','ab')or die('error alexa l abrir el archivo');
        fwrite($f,'viene del delay------'.' '.$llamar.' '.$arduino.'\n');
        fclose($f);

	if(fllama()==true){
		$output = shell_exec('php make_calls.php');
        	echo "<pre>$output</pre>";
		$f = fopen('flag.txt','wb')or die('error arduino al abrir el archivo');
                fwrite($f,1);
                fclose($f);

		exit();
	}
	else if(fllama()==false){
		$f = fopen('flag.txt','wb')or die('error arduino al abrir el archivo');
	        fwrite($f,1);
        	fclose($f);
		exit();
	}
	else {
		echo "error funcion fllama";
		exit();
	}
}
//--------------------------------------------------------------
//------------------------------viene post Alexa--------------------------------
/*if($llamar=='true'){
	$f = fopen('flag.txt','wb')or die('error alexa l abrir el archivo');
        fwrite($f,1);
        fclose($f);
	$f = fopen('log.txt','ab')or die('error alexa l abrir el archivo');
        fwrite($f,'viene del pos alexa true-----'.' '.$llamar.' '.$arduino.'\n');
        fclose($f);

	$output = shell_exec('php make_calls.php');
	echo "<pre>$output</pre>";
	unset($llamar);
        unset($arduino);
        unset($token);
	exit();
}
else if($llamar == 'false'){
	$f = fopen('flag.txt','ab')or die('error alexa l abrir el archivo');
        fwrite($f,0);
	unset($llamar);
	unset($arduino);
	unset($token);
	fclose($f);
	$f = fopen('log.txt','wb')or die('error alexa l abrir el archivo');
        fwrite($f,'viene del post alexa false-----'.' '.$llamar.' '.$arduino.'\n');
        fclose($f);

}*/
?>
