<?php

class ChecklistController extends AbstractController {

    private ChecklistManager $cm;
    private DateManager $dm;

    public function __construct()
    {
        $this->cm = new ChecklistManager;
        $this->dm = new DateManager;   
    }

    public function findAll() {
        $checklists = $this->cm->findAll();
        if ($checklists !=null) {
            $checklistsArray = [];
            foreach ($checklists as $checklist) {
                $newChecklist = $checklist->toArray();
                $checklistsArray[] = $newChecklist;
            }
            $this->render(["checklists" => $checklistsArray]);
        }
    }

    public function createChecklist(array $post) {
       
            $checklist = new Checklist(htmlspecialchars($post["in_sale"]));
            $newChecklist = $this->cm->createChecklist($checklist);
            $this->render(["success"=> true, "newChecklist"=>$newChecklist->toArray()]);
        
        
    }

    public function updateChecklist(array $post) {
        $checklist = $this->cm->findById($post["checklist_ID"]);
        if ($checklist !== null) {
            $checklist->setIn_sale(htmlspecialchars($post["in_sale"]));
            if (isset($post["inter"])) {
                $checklist->setInter(htmlspecialchars($post["inter"]));
            }
            if (isset($post["contrat_signed"])) {
                $checklist->setContrat_signed(htmlspecialchars($post["contrat_signed"]));
            } 
            if (isset($post["contrat_send"])) {
                $checklist->setContrat_send(htmlspecialchars($post["contrat_send"]));
            }
            if (isset($post["facture_send"])) {
                $checklist->setFacture_send(htmlspecialchars($post["facture_send"]));
            }
            if (isset($post["mail_adv"])) {
                $checklist->setMail_adv(htmlspecialchars($post["mail_adv"]));
            }
            if (isset($post["vhr"])) {
                $checklist->setVhr(htmlspecialchars($post["vhr"]));
            }
            if (isset($post["touring"])) {
                $checklist->setTouring(htmlspecialchars($post["touring"]));
            }
            if (isset($post["form"])) {
                $checklist->setForm($post["form"]);
            }
            if (isset($post["pre_settle"])) {
                $checklist->setPre_settle(htmlspecialchars($post["pre_settle"]));
            }
            if (isset($post["movin"])) {
                $checklist->setMovin($post["movin"]);
            }
            if (isset($post["justif_prod"])) {
                $checklist->setJustif_prod(htmlspecialchars($post["justif_prod"]));
            }
            if (isset($post["facture_contrat"])) {
                $checklist->setFacture_contrat(htmlspecialchars($post["facture_contrat"]));
            }
            if (isset($post["archive_status"])) {
                $checklist->setArchive_status(htmlspecialchars($post["archive_status"]));
            }
            $newChecklist = $this->cm->editChecklist($checklist);
            $date = $this->dm->findByChecklistId($checklist->getID());
            $this->render(["success" =>true, "editedChecklist"=> $newChecklist->toArray(), "dateUpdate" => $date->toArray()]);
        }
    }

    public function deleteChecklist(array $post) {
        $checklist = $this->cm->findById($post["checklist_ID"]);
        if ($checklist !== null) {
            $this->cm->deleteChecklist($checklist);
        }
    }
}