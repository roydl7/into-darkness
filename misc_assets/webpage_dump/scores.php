<?php require "..\ajax\mysql.php"; 



$query = "SELECT * FROM `into_darkness_data` ORDER BY score DESC";
$result = $conn -> query($query);



?>
<html>
<head>
<style>

@keyframes x {
	0% {  transform: rotate(2deg);}
	100% {  transform: rotate(299deg);}
}
</style>
<title>SCORE</title>

<body style=" background:black; color: green; font-family: Courier New; font-weight:bold; animation: x 92s infinite; ">
<br/>
<div style="background-image: url(images/mainfalcon1.png); height: 100%; width: 100%; border: 0px solid black;
 background-repeat: no-repeat">
   <body style="font-size: 60px; font-family: Gotham, 'Helvetica Neue', Helvetica, Arial, sans-serif; font-style: inherit; font-weight: bolder; color: #D48C8D;">
<span style="text-align: center" align="center" scope="col"></span>
<table width="700"  align="center" style="border: 8px solid green;">
  <tbody style="border: 1px solid green;">
    <tr  style="border: 1px solid green; font-size: 130px;">
      <th align="center"><img src="images/rank.png"/></th>
      <th><img src="images/name.png"/></th>
      <th><img src="images/score.png"/></th>
      <th><img src="images/time.png"/></th>
    </tr>
	
	<?php
	$i = 1;
	while($row = $result -> fetch_assoc()) {
	//	for($x = 1; $x < 5; $x++) {
	?>
		<tr>
		  <th  scope="row"><?php echo $i++; ?></th>
		  <td ><?php echo $row['tek_fname']; ?></td>
		  <td ><?php echo $row['score']; ?> </td>
		  <td ><?php echo $row['time']; ?> </td>
		</tr>
   
	<?php 
	}
	?>
  </tbody>
</table>
<p style="font-size: 36px">&nbsp;</p>
</body>



</div>


</body>
</html>