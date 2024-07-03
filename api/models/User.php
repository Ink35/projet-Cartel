<?php
class User {
    private int $id;
    public function __construct(private string $user_name, private string $role, private string $email, private string $password)
    {
        
    }

    public function toArray() {
        return [
            "user_ID" => $this->id,
            "user_name" => $this->user_name,
            "role" => $this->role,
            "email" => $this->email,
        ];
    }

    /**
     * Get the value of id
     *
     * @return  mixed
     */
    public function getId() : int
    {
        return $this->id;
    }

    /**
     * Set the value of id
     *
     * @param   mixed  $id  
     *
     * @return  self
     */
    public function setId(int $id) :self
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Get the value of user_name
     *
     * @return  mixed
     */
    public function getUser_name() :string
    {
        return $this->user_name;
    }

    /**
     * Set the value of user_name
     *
     * @param   mixed  $user_name  
     *
     * @return  self
     */
    public function setUser_name(string $user_name) :self
    {
        $this->user_name = $user_name;

        return $this;
    }

    /**
     * Get the value of role
     *
     * @return  mixed
     */
    public function getRole() :string
    {
        return $this->role;
    }

    /**
     * Set the value of role
     *
     * @param   mixed  $role  
     *
     * @return  self
     */
    public function setRole(string $role) :self
    {
        $this->role = $role;

        return $this;
    }

    /**
     * Get the value of email
     *
     * @return  mixed
     */
    public function getEmail() :string
    {
        return $this->email;
    }

    /**
     * Set the value of email
     *
     * @param   mixed  $email  
     *
     * @return  self
     */
    public function setEmail(string $email) :self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * Get the value of password
     *
     * @return  mixed
     */
    public function getPassword() :string
    {
        return $this->password;
    }

    /**
     * Set the value of password
     *
     * @param   mixed  $password  
     *
     * @return  self
     */
    public function setPassword(string $password) :self
    {
        $this->password = $password;

        return $this;
    }
}