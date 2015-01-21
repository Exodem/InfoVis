 <?php
 header("Access-Control-Allow-Origin: *");
 $response = file_get_contents("http://www.medien.ifi.lmu.de/cgi-bin/search.pl?all:all:all:all:all");
 echo($response);
 ?>




