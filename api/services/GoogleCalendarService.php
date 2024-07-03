<?php

class GoogleCalendarService 
    {
        private $client;
        private $service;
    
        public function __construct()
        {
            $this->client = new Google_Client();
            $this->client->setAuthConfig('calendar_key.json');
            $this->client->addScope(Google_Service_Calendar::CALENDAR_EVENTS);
            $this->service = new Google_Service_Calendar($this->client);
        }
    
        public function createEvent($calendarId, $summary, $startDateTime, $endDateTime, $description, $location)
        {
            $event = new Google_Service_Calendar_Event(array(
                'summary' => $summary,
                'location' => $location,
                'description' => $description,
                'start' => array(
                    'date' => $startDateTime,
                ),
                'end' => array(
                    'date' => $endDateTime,
                ),
            ));
        
            $event = $this->service->events->insert($calendarId, $event);
            // Vérifie si l'événement a été inséré avec succès
            if ($event) {
                return $event->getId(); // Retourne l'ID de l'événement
            } else {
                return null; // Retourne null en cas d'échec
            }
        }
        
    
        public function updateEvent($calendarId, $eventId, $summary, $startDateTime, $endDateTime, $description, $location)
        {
                try {
                    $event = $this->service->events->get($calendarId, $eventId);
                    $event->setSummary($summary);
                    $event->setDescription($description);
                    $event->setLocation($location);
                    $event->getStart()->setDate($startDateTime);
                    $event->getEnd()->setDate($endDateTime);
        
                    $updatedEvent = $this->service->events->update($calendarId, $event->getId(), $event);
                    return $updatedEvent;
                } catch (\Exception $e) {
                    throw new \Exception("Erreur lors de la mise à jour de l'événement : " . $e->getMessage());
                }
        }
        
    
        public function deleteEvent($calendarId, $eventId)
        {
            $this->service->events->delete($calendarId, $eventId);
        }

        public function addEvent()
        {
            $newEvent = $this->createEvent("cormier.antoine@gmail.com", 'Black Pumas',
            '2024-04-20',
            '2024-04-20',
            'La Maroquinerie',
            'Paris');
            return $newEvent;
        }
    }