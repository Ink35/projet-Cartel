<?php

class UserController extends AbstractController {
    
    private UserManager $um;

    public function __construct()
    {
        $this->um = new UserManager();
    }

    public function findAll() {
        $users = $this->um->findAll();
        if ($users != null) {
            $usersArray = [];
            foreach ($users as $user) {
                $newUser = $user->toArray();
                $usersArray[] = $newUser;
            }
            $this->render(["users"=> $usersArray]);
        } else {
            $this->render(["users" => "empty"]);
        }
    }


    public function createUser(array $post) {
      
        // if ($this->tokenManager->validateCSRFToken($post["csrf_token"])) {
            $passwordRegex = '/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*.]).{8,}$/';
            if (!preg_match($passwordRegex, $post["password"])) {
                $this->render(["success"=> false, "message" => "Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character and be at least 8 characters long"]);
                return;
            }
    
            if ($post["password"] !== $post["verify_password"]) {
                $this->render(["success"=> false, "message" => "Password does not match"]);
            } else {
                $user = $this->um->findByEmail(htmlspecialchars($post["email"]));
                if ($user === null) {
                    $hash = password_hash($post["password"], PASSWORD_DEFAULT);
                    $user = new User(
                        htmlspecialchars($post["user_name"]),
                        htmlspecialchars($post["email"]),
                        htmlspecialchars($post["role"]),
                        $hash,
                    );
                    $newUser = $this->um->createUser($user);
                    $this->render(["success"=> true, "newUser" => $newUser->toArray()]);
                } else {
                    $this->render(["success"=> false, "error_message"=> "User déja dans la BDD" ]);
                }
            }
        //  } else {
        //     $this->render(["connected"=> false, "message" => "Token validation failed", "token" => $_SESSION["csrf_token"]]); 
        // }
    }

    public function editUser(array $post) {
        $user = $this->um->findById($post["user_ID"]);
        if ($user !== null) {
            $user->setUser_name(htmlspecialchars($post["user_name"]));
            $user->setEmail(htmlspecialchars($post["email"]));
            $user->setRole(htmlspecialchars($post["role"]));
            $newUser = $this->um->editUser($user);
            $this->render(["success" => true, "editedUser"=> $newUser->toArray()]);
        }

    }

    public function editPasswordUser(array $post) {
        $user = $this->um->findById($post["user_ID"]);
        if ($user !== null) {
            $hash = password_hash($post["password"], PASSWORD_DEFAULT);
            $user->setPassword($hash);
            $newUser = $this->um->editPasswordUser($user);
            $this->render(["success" => true, "editedUser"=> $newUser->toArray()]);
        } 
    }

    public function deleteUser(array $post) {
        $user = $this->um->findById($post["user_ID"]);
        if ($user !== null) {
            $this->um->deleteUser($user);
        }
    }
}