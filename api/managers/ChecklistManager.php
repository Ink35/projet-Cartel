<?php

class ChecklistManager extends AbstractManager {

    public function findAll() :?array {
        $query = $this->db->prepare("SELECT * FROM checklist");
        $query->execute();
        $checklists = $query->fetchAll(PDO::FETCH_ASSOC);
        if ($checklists != null) {
            $checklistsArray = [];
            foreach($checklists as $checklist) {
                $newChecklist = new Checklist($checklist["in_sale"]);
                $newChecklist->setInter($checklist["inter"]);
                $newChecklist->setContrat_signed($checklist["contrat_signed"]);
                $newChecklist->setContrat_send($checklist["contrat_send"]);
                $newChecklist->setFacture_send($checklist["facture_send"]);
                $newChecklist->setMail_adv($checklist["mail_adv"]);
                $newChecklist->setVhr($checklist["vhr"]);
                $newChecklist->setTouring($checklist["touring"]);
                $newChecklist->setForm($checklist["form"]);
                $newChecklist->setPre_settle($checklist["pre_settle"]);
                $newChecklist->setMovin($checklist["movin"]);
                $newChecklist->setJustif_prod($checklist["justif_prod"]);
                $newChecklist->setFacture_contrat($checklist["facture_contrat"]);
                $newChecklist->setArchive_status($checklist["archive_status"]);
                $newChecklist->setId($checklist["checklist_ID"]);
                $checklistsArray[] = $newChecklist;
            }
           return $checklistsArray;
        } else {
            return null;
        }
    }

    public function findById($id) : ?Checklist {
        $query = $this->db->prepare("SELECT * FROM checklist WHERE checklist_ID = :checklist_ID");
        $parameters = [
            "checklist_ID" => $id,
        ];
        $query->execute($parameters);
        $checklist = $query->fetch(PDO::FETCH_ASSOC);
        
        if ($checklist !== false) {
            $newChecklist = new Checklist($checklist["in_sale"]);
            $newChecklist->setInter($checklist["inter"]);
            $newChecklist->setContrat_signed($checklist["contrat_signed"] ?? null);
            $newChecklist->setContrat_send($checklist["contrat_send"] ?? null);
            $newChecklist->setFacture_send($checklist["facture_send"] ?? null);
            $newChecklist->setMail_adv($checklist["mail_adv"] ?? null);
            $newChecklist->setVhr($checklist["vhr"] ?? null);
            $newChecklist->setTouring($checklist["touring"] ?? null);
            $newChecklist->setForm($checklist["form"] ?? null);
            $newChecklist->setPre_settle($checklist["pre_settle"] ?? null);
            $newChecklist->setMovin($checklist["movin"] ?? null);
            $newChecklist->setJustif_prod($checklist["justif_prod"] ?? null);
            $newChecklist->setFacture_contrat($checklist["facture_contrat"] ?? null);
            $newChecklist->setArchive_status($checklist["archive_status"] ?? null);
            $newChecklist->setId($checklist["checklist_ID"]);
            
            return $newChecklist;
        } else {
            return null;
        }
    }
    

    public function createChecklist(Checklist $checklist) :?Checklist {
        $query = $this->db->prepare("INSERT INTO checklist (in_sale, archive_status) VALUES (:in_sale, :archive_status)");
        $parameters = [
            "in_sale" => $checklist->getIn_sale(),
            "archive_status" => "false",
        ];
        $query->execute($parameters);
        $lastId = $this->db->lastInsertId();
        $checklist->setId($lastId);
        return $this->findById($checklist->getId());
    }

    public function editChecklist(Checklist $checklist) :?Checklist {
        $query = $this->db->prepare("UPDATE checklist 
            SET in_sale = :in_sale,
                inter = :inter,
                contrat_signed = :contrat_signed,
                contrat_send = :contrat_send,
                facture_send = :facture_send,
                mail_adv = :mail_adv,
                vhr = :vhr,
                touring = :touring,
                form = :form,
                pre_settle = :pre_settle,
                movin = :movin,
                justif_prod = :justif_prod,
                facture_contrat = :facture_contrat,
                archive_status = :archive_status
            WHERE checklist_ID = :checklist_ID");
        $parameters = [
            "in_sale" => $checklist->getIn_sale(),
            "inter" => $checklist->getInter(),
            "contrat_signed" => $checklist->getContrat_signed(),
            "contrat_send" => $checklist->getContrat_send(),
            "facture_send" => $checklist->getFacture_send(),
            "mail_adv" => $checklist->getMail_adv(),
            "vhr" => $checklist->getVhr(),
            "touring" => $checklist->getTouring(),
            "form" => $checklist->getForm(),
            "pre_settle" => $checklist->getPre_settle(),
            "movin" => $checklist->getMovin(),
            "justif_prod" => $checklist->getJustif_prod(),
            "facture_contrat" => $checklist->getFacture_contrat(),
            "archive_status" => $checklist->getArchive_status(),
            "checklist_ID" => $checklist->getId(),

        ];
        $query->execute($parameters);
        return $this->findById($checklist->getId());
    }

    public function deleteChecklist(Checklist $checklist) :void {
        $query = $this->db->prepare("DELETE FROM checklist WHERE checklist_ID = :checklist_ID");
        $parameters = [
            "checklist_ID" => $checklist->getId(),
        ];
        $query->execute($parameters);
    }
}