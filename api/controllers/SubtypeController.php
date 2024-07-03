<?php 
class SubtypeController extends AbstractController {

    private SubtypeManager $stm;
    private TypeManager $tm;

    public function __construct()
    {
        $this->stm = new SubtypeManager;
        $this->tm = new TypeManager;
    }

    public function findAll() {
        $subtypes = $this->stm->findAll();
        if ($subtypes != null) {
            $subtypesArray = [];
            foreach ($subtypes as $subtype) {
                $newSubtype = $subtype->toArray();
                $subtypesArray[] = $newSubtype;
            }
            $this->render(["subtypes" => $subtypesArray]);
        }
    }

    public function createSubtype(array $post) {
        $subtype = $this->stm->findByName(htmlspecialchars($post["subtype"]));
        if ($subtype === null) {
            $type = $this->tm->findById($post["type_ID"]);
            $subtype = new Subtype(htmlspecialchars($post["subtype"]), $type);
            $newSubtype = $this->stm->createSubtype($subtype);
            $this->render(["success"=> true, "newSubtype" => $newSubtype->toArray()]);
        } else {
            $this->render(["success"=> false, "error_message"=> "subtype déja dans la BDD" ]);
        }   
    }

    public function editSubtype(array $post) {
        $subtype = $this->stm->findById($post["subtype_ID"]);
        if ($subtype !== null) {
            $subtype->setSubtype(htmlspecialchars($post["subtype"]));
            $newSubtype = $this->stm->editSubtype($subtype);
            $this->render(["success" => true, "editedSubtype"=> $newSubtype->toArray()]);
        }
    }

    public function deleteSubtype(array $post) {
        $subtype = $this->stm->findById($post["subtype_ID"]);
        if ($subtype !== null) {
            $this->stm->deleteSubtype($subtype);
       }
    }
}