<?php 

class StructureManager extends AbstractManager {
    public function findAll() :?array {
        $query = $this->db->prepare("SELECT * FROM structures");
        $query->execute();
        $structures = $query->fetchAll(PDO::FETCH_ASSOC);
        if ($structures != null) {
            $structuresArray= [];
            foreach ($structures as $structure) {
                $newStructure = new Structure($structure["structure_name"]);
                $newStructure->setId($structure["ID"]);
                $structuresArray[]= $newStructure;
            }
            return $structuresArray;
        } else {
            return null;
        }
    }

    public function findById($id) :?Structure {
        $query = $this->db->prepare("SELECT * FROM structures WHERE ID = :id");
        $parameters = [
            "id"=> $id
        ];
        $query->execute($parameters);
        $structure = $query->fetch(PDO::FETCH_ASSOC);
        if ($structure != null) {
            $newStructure = new Structure($structure["structure_name"]);
            $newStructure->setId($structure["ID"]);
            return $newStructure;
        } else {
            return null;
        }
    }

    public function findByName(string $structure_name) :?Structure {
        $query = $this->db->prepare("SELECT * FROM structures WHERE structure_name = :structure_name");
        $parameters = [
            "structure_name"=> $structure_name
        ];
        $query->execute($parameters);
        $structure = $query->fetch(PDO::FETCH_ASSOC);
        if ($structure != null) {
            return $structure;
        } else {
            return null;
        }
    }

    public function createStructure(Structure $structure) :?Structure {
        $query = $this->db->prepare("INSERT INTO structures VALUE(null, :structure_name)");
        $parameters = [
            "structure_name" => $structure->getstructure_name()
        ];
        $query->execute($parameters);
        $lastId = $this->db->lastInsertId();
        $structure->setId($lastId);
        return $this->findById($structure->getId());
    }

    public function editStructure(Structure $structure) :?Structure {
        $query = $this->db->prepare("UPDATE structures SET structure_name = :structure_name WHERE structure_ID = :structure_ID");
        $parameters = [
            "structure_name"=> $structure->getStructure_name(),
            "structure_ID"=> $structure->getId()
        ];
        $query->execute($parameters);
        return $this->findById($structure->getId());
    }

    public function deleteStructure(Structure $structure) : void {
        $query = $this->db->prepare("DELETE FROM structures WHERE ID = :structure_id");
        $parameters = [
            "structure_id" => $structure->getId()
        ];
        $query->execute($parameters);
    }
}