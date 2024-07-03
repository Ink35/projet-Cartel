<?php 

class UserManager extends AbstractManager {

    public function findAll() :?array {
        $query = $this->db->prepare("SELECT * FROM users");
        $query->execute();
        $users = $query->fetchAll(PDO::FETCH_ASSOC);
        if ($users != null) {
            $usersArray= [];
            foreach ($users as $user) {
                $newUser = new User($user["user_name"], $user["role"], $user['email'], $user['password']);
                $newUser->setId($user["ID"]);
                $usersArray[]= $newUser;
            }
            return $usersArray;
        } else {
            return null;
        }
    }

    public function findById($id) :?User {
        $query = $this->db->prepare("SELECT * FROM users WHERE ID = :id");
        $parameters = [
            "id"=> $id
        ];
        $query->execute($parameters);
        $user = $query->fetch(PDO::FETCH_ASSOC);
        if ($user != null) {
            $newUser = new User($user["user_name"], $user["role"], $user['email'], $user['password']);
            $newUser->setId($user["ID"]);
            return $newUser;
        } else {
            return null;
        }
    }

    public function findByEmail($email) :?User {
        $query = $this->db->prepare("SELECT * FROM users WHERE email = :email");
        $parameters = [
            "email"=> $email
        ];
        $query->execute($parameters);
        $user = $query->fetch(PDO::FETCH_ASSOC);
        if ($user != null) {
            $newUser = new User($user["user_name"], $user["role"], $user['email'], $user['password']);
            $newUser->setId($user["ID"]);
            return $newUser;
        } else {
            return null;
        }
    }

    public function createUser(User $user): ?User {
        $query = $this->db->prepare("INSERT INTO users VALUES (null, :user_name, :email, :role, :password)");
        $parameters = [
            "user_name" => $user->getUser_name(),
            "email" => $user->getEmail(),
            "role" => $user->getRole(),
            "password" => $user->getPassword()
        ];
        $query->execute($parameters);
        $lastId = $this->db->lastInsertId();
        $user->setId($lastId);
        return $this->findById($user->getId());
    }
    

    public function deleteUser(User $user) : void {
        $query = $this->db->prepare("DELETE FROM users WHERE ID = :user_id");
        $parameters = [
            "user_id" => $user->getId()
        ];
        $query->execute($parameters);
    }

    public function editUser(User $user) : ?User {
        var_dump($user);
        $query = $this->db->prepare("UPDATE users SET user_name = :user_name, role = :role,  email = :email WHERE ID = :user_ID");
        $parameters = [
            "user_name" => $user->getUser_name(),
            "email" => $user->getEmail(),
            "role" => $user->getRole(),
            "user_ID" => $user->getId(),
        ];
        $query->execute($parameters);
        return $this->findById($user->getId());
    }

    public function editPasswordUser(User $user) : ?User {
        $query = $this->db->prepare("UPDATE users SET password = :password WHERE ID = :user_ID");
        $parameters = [
            "password" => $user->getPassword(),
            "user_ID" => $user->getId(),
        ];
        $query->execute($parameters);
        return $this->findById($user->getId());
    }
}