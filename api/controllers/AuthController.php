<?php 
class AuthController extends AbstractController {

    private GoogleCalendarService $auth;
    private CSRFTokenManager $tokenManager;
    private UserManager $um;

    public function __construct()
    {
        $this->auth = new GoogleCalendarService();
        $this->tokenManager = new CSRFTokenManager();
        $this->um = new UserManager();
    }

    public function addEvent() {
        $event = $this->auth->addEvent();
        $this->render(["event" => $event]);
    }

    public function login(array $post) : void {
        // if ($this->tokenManager->validateCSRFToken($post["csrf_token"])){
            if (isset($post["password"]) && isset($post["email"])) {
                $email = $post["email"];
                $password = $post["password"];
                $user = $this->um->findByEmail($email);
                if ($user) {
                    if (password_verify($password, $user->getPassword())) {
                        $this->render(["connected"=> true, "data" => $user->toArray()]);
                    } else {
                        $this->render(["connected"=> false, "message" => "Wrong password"]);
                    }
                } else {
                    $this->render(["connected"=> false, "message" => "Email does not exist"]);
                }
            } else {
                $this->render(["connected"=> false, "message" => "Email and password are required"]);
            }
        // } else {
        //     $this->render(["connected"=> false, "message" => "Token validation failed", "token" => $_SESSION["csrf_token"]]); 
        // } 
    }

    public function createUser(array $post) :void {
        
        // if ($this->tokenManager->validateCSRFToken($post["csrf_token"])) {
            $passwordRegex = '/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*.]).{8,}$/';
            if (!preg_match($passwordRegex, $post["password"])) {
                $this->render(["success"=> false, "message" => "Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character and be at least 8 characters long"]);
                return;
            }
    
            if ($post["password"] !== $post["verify_password"]) {
                $this->render(["success"=> false, "message" => "Password does not match"]);
            } else {
                $user = $this->um->findByEmail($post["email"]);
                if ($user === null) {
                    $hash = password_hash($post["password"], PASSWORD_DEFAULT);
                    
                    $newUser = new User(
                        htmlspecialchars($post["user_name"]),
                        htmlspecialchars($post["role"]),
                        htmlspecialchars($post["email"]),
                        $hash,
                    );
                    
                    $newNewUser = $this->um->createUser($newUser);
                    $_SESSION["user"] = $newNewUser;
    
                    $this->render(["success"=> true, "data" => $newNewUser->toArray(), "connected"=> true]);
                } else {
                    $this->render(["success"=> false, "message" => "Email already exists"]);
                }
            }
        // } else {
        //     $this->render(["success"=> false, "message" => "Token validation failed"]);
        // }
    }

    public function logout() :void {
        session_destroy();
        $this->render(["connected"=> false, "message" => "User Logged Out", "data" => []]);
    }
}