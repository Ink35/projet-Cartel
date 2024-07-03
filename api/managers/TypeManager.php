<?php 
class TypeManager extends AbstractManager {

    public function findAll() :?array {
        $query = $this->db->prepare("SELECT * FROM types");
        $query->execute();
        $types = $query->fetchAll(PDO::FETCH_ASSOC);
        if ($types != null) {
            $typesArray= [];
            foreach ($types as $type) {
                $newType = new Type($type["type"]);
                $newType->setId($type["ID"]);
                $typesArray[]= $newType;
            }
            return $typesArray;
        } else {
            return null;
        }
    }

    public function findById($id) :?Type {
        $query = $this->db->prepare("SELECT * FROM types WHERE ID = :id");
        $parameters = [
            "id"=> $id
        ];
        $query->execute($parameters);
        $type = $query->fetch(PDO::FETCH_ASSOC);
        if ($type != null) {
            $newType = new Type($type["type"]);
            $newType->setId($type["ID"]);
            return $newType;
        } else {
            return null;
        }
    }

    public function findByName(string $type) : ?Type {
        $query = $this->db->prepare("SELECT * FROM types WHERE type = :type");
        $parameters = [
            "type"=> $type
        ];
        $query->execute($parameters);
        $type = $query->fetch(PDO::FETCH_ASSOC);
        if ($type != null) {
            $newType = new Artiste($type["type"]);
            $newType->setId($type["ID"]);
            return $newType;
        } else {
            return null;
        }
    }

    public function createType(Type $type) :?Type {
        $query = $this->db->prepare("INSERT INTO types VALUE(null, :type)");
        $parameters = [
            "type" => $type->getType()
        ];
        $query->execute($parameters);
        $lastId = $this->db->lastInsertId();
        $type->setId($lastId);
        return $this->findById($type->getId());
    }

    public function editType(Type $type) :?Type {
        $query = $this->db->prepare("UPDATE types SET type = :type WHERE ID = :type_ID");
        $parameters = [
            "type"=> $type->getType(),
            "type_ID"=> $type->getId()
        ];
        $query->execute($parameters);
        return $this->findById($type->getId());
    }

    public function deleteType(type $type) : void {
        $query = $this->db->prepare("DELETE FROM types WHERE ID = :type_id");
        $parameters = [
            "type_id" => $type->getId()
        ];
        $query->execute($parameters);
    }
}