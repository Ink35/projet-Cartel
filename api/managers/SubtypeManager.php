<?php

class SubtypeManager extends AbstractManager {

    public function findAll() :?array {
        $query = $this->db->prepare("SELECT * FROM subtypes");
        $query->execute();
        $subtypes = $query->fetchAll(PDO::FETCH_ASSOC);
        if ($subtypes != null) {
            $subtypesArray= [];
            $tm = new TypeManager();
            foreach ($subtypes as $subtype) {
                $type = $tm->findById($subtype["type_ID"]);
                $newSubtype = new Subtype($subtype["subtype"], $type);
                $newSubtype->setId($subtype["ID"]);
                $subtypesArray[]= $newSubtype;
            }
            return $subtypesArray;
        } else {
            return null;
        }
    }

    public function findAllSubtypeByType(Type $type) :?array {
        $query = $this->db->prepare("SELECT * FROM subtypes WHERE type_ID = :type_ID");
        $parameters = [
            "type_ID" => $type->getId()
        ];
        $query->execute($parameters);
        $subtypes=$query->fetchAll(PDO::FETCH_ASSOC);
        if ($subtypes != null) {
            $subtypesArray= [];
            $tm = new TypeManager();
            foreach ($subtypes as $subtype) {
                $type = $tm->findById($subtype["type_ID"]);
                $newSubtype = new Subtype($subtype["subtype"], $type);
                $newSubtype->setId($subtype["ID"]);
                $subtypesArray[]= $newSubtype;
            }
            return $subtypesArray;
        } else {
            return null;
        }
    }

    public function findById($id) :?Subtype {
        $query = $this->db->prepare("SELECT * FROM subtypes WHERE ID = :id");
        $parameters = [
            "id"=> $id
        ];
        $query->execute($parameters);
        $subtype = $query->fetch(PDO::FETCH_ASSOC);
        if ($subtype != null) {
            $tm = new TypeManager();
            $type = $tm->findById($subtype["type_ID"]);
            $newSubtype = new Subtype($subtype["subtype"], $type);
            $newSubtype->setId($subtype["ID"]);
            return $newSubtype;
        } else {
            return null;
        }
    }

    public function findByName(string $subtype) :?Subtype {
        $query = $this->db->prepare("SELECT * FROM subtypes WHERE subtype = :subtype");
        $parameters = [
            "subtype"=> $subtype
        ];
        $query->execute($parameters);
        $subtype = $query->fetch(PDO::FETCH_ASSOC);
        if ($subtype != null) {
            return $subtype;
        } else {
            return null;
        }
    }

    public function createSubtype(Subtype $subtype) :?Subtype {
        $query = $this->db->prepare("INSERT INTO subtypes VALUE(null, :type_ID, :subtype)");
        $parameters = [
            "type_ID"=> $subtype->getType()->getId(),
            "subtype" => $subtype->getSubtype()
        ];
        $query->execute($parameters);
        $lastId = $this->db->lastInsertId();
        $subtype->setId($lastId);
        return $this->findById($subtype->getId());
    }

    public function editSubtype(Subtype $subtype) :?Subtype {
        $query = $this->db->prepare("UPDATE subtypes SET type_ID = :type_ID, subtype = :subtype WHERE subtype_ID = :subtype_ID");
        $parameters = [
            "type_ID"=> $subtype->getType()->getId(),
            "subtype"=> $subtype->getSubtype(),
            "subtype_ID"=> $subtype->getId()
        ];
        $query->execute($parameters);
        return $this->findById($subtype->getId());
    }

    public function deleteSubtype(Subtype $subtype) : void {
        $query = $this->db->prepare("DELETE FROM subtypes WHERE ID = :subtype_id");
        $parameters = [
            "subtype_id" => $subtype->getId()
        ];
        $query->execute($parameters);
    }
}