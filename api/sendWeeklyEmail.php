<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

function sendWeeklyEmail() {
    $mail = new PHPMailer(true);

    // Appel à l'API et récupération des données
    $url = 'https://api.booking-cartel.fr/dates';
    $response = file_get_contents($url);
    $data = json_decode($response, true);
    setlocale(LC_TIME, 'fr_FR.UTF-8');

    if ($data === null) {
        die('Erreur lors de la récupération des données de l\'API');
    } else {
        // Définir les bornes de temps
        $current_year = date('Y');
        $next_year = $current_year + 1;

        $dates_current_year = ['production' => [], 'vente' => []];
        $dates_next_year = ['production' => [], 'vente' => []];

        // Parcourir chaque élément de votre tableau de dates
        foreach ($data['dates'] as $item) {
            // Convertir la date en timestamp
            $event_timestamp = strtotime($item['date']);
            $event_year = date('Y', $event_timestamp);

            // Vérifier si la date est dans l'année souhaitée
            if ($item['status'] === 'confirmed') {
                $default_img_url = 'https://plus.unsplash.com/premium_photo-1678216285963-253d94232eb7?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
                $artiste_name = $item['artiste']['artiste_name'];
                $date = $event_timestamp; // Utiliser le timestamp directement
                $place_name = $item['place']['place_name'];
                $city_name = $item['city']['city_name'];
                $status = $item['status']; // Récupérer le statut
                $structure = isset($item['structure']['structure_name']) ? $item['structure']['structure_name'] : 'N/A';
                $booker = $item['user']['user_name'];
                $type = $item['type']['type'];
                $img_url = !empty($item['artiste']['img_url']) ? $item['artiste']['img_url'] : $default_img_url;
                $timestamp = $item["timestamp"];
                $timestamp_num = strtotime($timestamp);

                $date_info = [
                    'date' => $date,
                    'place' => $place_name,
                    'city' => $city_name,
                    'status' => $status,
                    'timestamp' => $timestamp,
                    'timestamp_num' => $timestamp_num,
                    'type' => $type,
                    'structure' => $structure,
                    'img_url' => $img_url,
                    'booker' => $booker,
                ];

                if ($event_year == $current_year) {
                    if (!isset($dates_current_year[$type][$artiste_name])) {
                        $dates_current_year[$type][$artiste_name] = [
                            'total_dates' => 0,
                            'dates' => [],
                            'img_url' => $img_url,
                            'booker' => $booker,
                            'structure' => $structure,
                        ];
                    }
                    $dates_current_year[$type][$artiste_name]['dates'][] = $date_info;
                    $dates_current_year[$type][$artiste_name]['total_dates']++;
                } else if ($event_year == $next_year) {
                    if (!isset($dates_next_year[$type][$artiste_name])) {
                        $dates_next_year[$type][$artiste_name] = [
                            'total_dates' => 0,
                            'dates' => [],
                            'img_url' => $img_url,
                            'booker' => $booker,
                            'structure' => $structure,
                        ];
                    }
                    $dates_next_year[$type][$artiste_name]['dates'][] = $date_info;
                    $dates_next_year[$type][$artiste_name]['total_dates']++;
                }
            }
        }

        // Fonction de comparaison pour trier les dates
        function compareDates($a, $b) {
            return $a['date'] - $b['date'];
        }

        // Trier les dates pour chaque artiste
        foreach ($dates_current_year as &$types) {
            foreach ($types as &$artist_data) {
                usort($artist_data['dates'], 'compareDates');
            }
        }
        unset($artist_data);

        foreach ($dates_next_year as &$types) {
            foreach ($types as &$artist_data) {
                usort($artist_data['dates'], 'compareDates');
            }
        }
        unset($artist_data);

        // Trier les artistes par ordre alphabétique et par structure
        function compareArtists($a, $b) {
            return strcasecmp($a, $b);
        }
        foreach ($dates_current_year as &$type_data) {
            uksort($type_data, 'compareArtists');
        }
        unset($type_data);

        foreach ($dates_next_year as &$type_data) {
            uksort($type_data, 'compareArtists');
        }
        unset($type_data);

        // Initialiser une variable pour stocker le contenu HTML du body de l'email
        $week_number = date('W'); // Récupérer le numéro de la semaine
        $email_body = '<html><head><title>Planning Cartel : Semaine ' . $week_number . '</title></head><body>';
    // Fonction pour générer le contenu HTML pour chaque section
    function generateSection($dates, $type, $sectionTitle) {
        $section = "<h2 style='color: #ff9494; font-size: 25px; font-style: underline;'>$sectionTitle</h2>";
        $section .= "<div class='row'>";
        foreach ($dates[$type] as $artiste_name => $artist_data) {
            $section .= "<table style='width: 100%, max-width: 1000px'>
                            <tr>
                                <td style='font-size: 20px; font-weight: bold; color: #ff9494;'>" . strtoupper(htmlspecialchars_decode($artiste_name)) . "</td>
                                <td style='text-align:center;  padding: 20px'>Booker : {$artist_data['booker']}</td>
                                <td style='text-align:center;  padding: 20px'>{$artist_data['structure']}</td>
                                <td style='text-align:center;  padding: 20px'>#Dates : {$artist_data['total_dates']}</td>
                            </tr>
                        </table>";
            $section .= "<table style='border-bottom: 5px solid black; border-collapse: collapse; width: 100%; line-height: normal; max-width: 1000px'>
                <tr style='background-color: black; color: white;'>
                    <th style='text-align:center; border: 1px solid black; padding: 2px; min-width: 100px; max-width: 200px'>Date</th>
                    <th style='text-align:center; border: 1px solid black; padding: 2px;'>Ville</th>
                    <th style='text-align:center; border: 1px solid black; padding: 2px;'>Salle/Festival</th>
                    <th style='text-align:center; border: 1px solid black; padding: 2px;'></th>
                </tr>";

            foreach ($artist_data['dates'] as $date_info) {
                $time_difference = time() - $date_info['timestamp_num'];
                $is_new_date = $time_difference < (7 * 86400);// 86400 secondes correspondent à une journée
                $new_date_text = $is_new_date ? '<p style="color: green; font-weight: bold; font-style: italic;">New</p>' : '';
                $formatted_date = date('d.m.y', $date_info['date']);
                $date_passee = $date_info['date'] < time();
                $checkbox_html = $date_passee ? '<input type="checkbox" checked disabled>' : '<input type="checkbox" disabled>';
                $section .= "<tr>
                    <td style='width: 100px;text-align:center; border: 1px solid black; padding: 2px;'>$checkbox_html $formatted_date</td>
                    <td style='width: 100px;text-align:center; border: 1px solid black; padding: 2px;'>{$date_info['city']}</td>
                    <td style='width: 100px;text-align:center; border: 1px solid black; padding: 2px;'>{$date_info['place']}</td>
                    <td style='width: 10px; text-align:center; border: 1px solid black; padding: 2px;'><span style='color: #ff9494;'>{$new_date_text}</span></td>
                </tr>";
            }

            $section .= "</table>";
        }
        $section .= "</div>";
        return $section;
    }
        // Ajouter les sections pour chaque année
        $email_body .= "<h1>$current_year</h1>";
        $email_body .= generateSection($dates_current_year, 'production', 'Prod');
        $email_body .= generateSection($dates_current_year, 'vente', 'Booking');

        $email_body .= "<h1>$next_year</h1>";
        $email_body .= generateSection($dates_next_year, 'production', 'Prod');
        $email_body .= generateSection($dates_next_year, 'vente', 'Booking');

        $email_body .= '</body></html>';

        

        try {
            $mail->isSMTP();
            $mail->Host = 'smtp.hostinger.com';
            $mail->SMTPAuth = true;
            $mail->Username = "planning@booking-cartel.fr";
            $mail->Password = 'Antgui007!';
            $mail->SMTPSecure = "tls";
            $mail->Port = 587;
    
            $mail->setFrom("planning@booking-cartel.fr", "Cartel Recap");
            $mail->addAddress("cormier.antoine@gmail.com");
            $mail->addAddress("antoine@cartelconcerts.com");
            $mail->addAddress("prod1@cartelconcerts.com");
    
            $mail->CharSet = 'UTF-8';
            $mail->isHTML(true);
            $mail->Subject = "Planning Cartel : Semaine $week_number";
            $mail->Body = $email_body;
    
            $mail->send();
            echo 'E-mail envoyé avec succès';
        } catch (Exception $e) {
            echo "Erreur lors de l'envoi de l'email : ", $mail->ErrorInfo;
        }
    }
}

sendWeeklyEmail();
?>
