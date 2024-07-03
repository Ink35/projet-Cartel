<?php

use Eluceo\iCal\Domain\Entity\Event;
use Eluceo\iCal\Domain\ValueObject\Date;
use Eluceo\iCal\Domain\ValueObject\SingleDay;
use Eluceo\iCal\Presentation\Factory\CalendarFactory;
use Eluceo\iCal\Domain\Entity\Calendar;

class CalendarManager {

    public function createEvent() {
        // Chemin du fichier iCal sur le serveur
        $filePath = 'ical_files/cal.ics';

        // Création de l'événement
        $newEvent = new Event();
        $newEvent
            ->setSummary('Test 8')
            ->setDescription('LETGO')
            ->setOccurrence(
                new SingleDay(
                    new Date(\DateTimeImmutable::createFromFormat('Y-m-d', '2024-04-21'))
                )
            );

        // Création du calendrier
        $calendar = new Calendar([$newEvent]);

        // Transformation du calendrier en iCalendar
        $componentFactory = new CalendarFactory();
        $calendarComponent = $componentFactory->createCalendar($calendar);

        // En-têtes HTTP
        header('Content-Type: text/calendar; charset=utf-8');
        header('Content-Disposition: attachment; filename="cal.ics"');

        // Écriture du contenu mis à jour dans le fichier iCal
        file_put_contents($filePath, $calendarComponent);

        // Retour de l'URL du fichier iCal
        $url = 'https://apicartel.kindr.fr/ical_files/cal.ics';

        return $url;
    }
}
