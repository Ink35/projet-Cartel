import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createUser, getAllUsers } from "../actions/auth.action"; // Importez votre action de création d'utilisateur
import UserList from "./UserList";
import "../styles/createUser.css";

const CreateUser = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    verify_password: "",
    user_name: "",
    role: "admin",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, role: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Préparer la requête
    const newUser = new FormData();
    newUser.append("email", formData.email);
    newUser.append("password", formData.password);
    newUser.append("verify_password", formData.verify_password);
    newUser.append("user_name", formData.user_name);
    newUser.append("role", formData.role);

    // Dispatch de l'action pour créer l'utilisateur
    dispatch(createUser(newUser)).then(() => {
      dispatch(getAllUsers());
    });
    // Réinitialiser le formulaire après la création de l'utilisateur si nécessaire
    setFormData({
      email: "",
      password: "",
      verify_password: "",
      user_name: "",
      role: "admin",
    });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="row g-3 needs-validation form-create-user"
        noValidate
      >
        <div className="col-md-4">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="password" className="form-label">
            Mot de Passe
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            title="Le mot de passe doit contenir au moins un chiffre, une lettre majuscule, une lettre minuscule, un caractère spécial et être d'au moins 8 caractères de longueur."
            pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="verify_password" className="form-label">
            Confirmer Mot de Passe
          </label>
          <input
            type="password"
            className={
              "form-control " +
              (formData.password !== formData.verify_password
                ? "is-invalid"
                : "")
            }
            id="verify_password"
            name="verify_password"
            value={formData.verify_password}
            onChange={handleChange}
            required
          />
          {formData.password !== formData.verify_password && (
            <div className="invalid-feedback">
              Les mots de passe ne correspondent pas.
            </div>
          )}
        </div>

        <div className="col-md-4">
          <label htmlFor="user_name" className="form-label">
            Nom d'utilisateur
          </label>
          <input
            type="text"
            className="form-control"
            id="user_name"
            name="user_name"
            value={formData.user_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="floatingSelect" className="form-label">
            Role
          </label>
          <select
            className="form-select"
            id="floatingSelect"
            aria-label="Role Selection"
            value={formData.role}
            onChange={handleRoleChange}
            required
          >
            <option value="admin">Admin</option>
            <option value="booker">Booker</option>
            <option value="booker ext">Booker Invité</option>
            <option value="compta">Compta</option>
            <option value="prod">Prod</option>
          </select>
        </div>

        <div className="col-12">
          <button
            className="btn-classique"
            type="submit"
            disabled={
              formData.email === "" ||
              formData.password === "" ||
              formData.verify_password === "" ||
              formData.user_name === "" ||
              formData.password !== formData.verify_password
            }
          >
            Créer un utilisateur
          </button>
        </div>
      </form>
      <UserList />
    </>
  );
};

export default CreateUser;
