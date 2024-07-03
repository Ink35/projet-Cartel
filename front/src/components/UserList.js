import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUser,
  editPasswordUser,
  editUser,
  getAllUsers,
} from "../actions/auth.action";
import { selectUsers } from "../reducers/auth.reducer";
import TableBooker from "./tableBooker";
import "../styles/userList.css";

const UserList = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const [userEditId, setUserEditId] = useState(null);
  const [userPasswordID, setUserPasswordID] = useState(null);
  const [user_id, setUser_id] = useState(null);
  const tableRef = useRef(null);
  const [formData, setFormData] = useState({
    user_ID: "",
    email: "",
    user_name: "",
    role: "admin",
    password: "",
  });

  useEffect(() => {
    dispatch(getAllUsers());

    // Ajoute un gestionnaire d'événements pour détecter les clics en dehors de la table
    const handleClickOutside = (event) => {
      if (tableRef.current && !tableRef.current.contains(event.target)) {
        // Clic en dehors de la table, met à jour les états à null
        setUserEditId(null);
        setUserPasswordID(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Nettoie le gestionnaire d'événements lors du démontage du composant
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch]);

  const handleEdit = (id) => {
    setUserPasswordID(null);
    setUserEditId(id);
    const userToEdit = users.find((user) => user.user_ID === id);
    if (userToEdit) {
      setFormData({
        user_ID: id,
        email: userToEdit.email,
        password: userToEdit.password,
        user_name: userToEdit.user_name,
        role: userToEdit.role,
      });
    }
  };

  const handlePasswordChange = (id) => {
    setUserPasswordID(id);
    setUserEditId(null);
    setFormData({
      user_ID: id,
      password: "",
    });
  };

  const handleSubmit = () => {
    const newUser = new FormData();
    newUser.append("user_ID", formData.user_ID);
    newUser.append("email", formData.email);
    newUser.append("user_name", formData.user_name);
    newUser.append("role", formData.role);
    dispatch(editUser(newUser)).then(() => {
      dispatch(getAllUsers());
      setUserEditId(null);
    });
  };

  const handleSubmitPassword = () => {
    const newPassword = new FormData();
    newPassword.append("user_ID", formData.user_ID);
    newPassword.append("password", formData.password);
    dispatch(editPasswordUser(newPassword)).then(() => {
      dispatch(getAllUsers());
      setUserPasswordID(null);
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDelete = (id) => {
    const deleteForm = new FormData();
    deleteForm.append("user_ID", id);
    dispatch(deleteUser(deleteForm)).then(() => {
      dispatch(getAllUsers());
    });
  };

  const handleDateByUser = (id) => {
    setUser_id(id);
  };

  return (
    <div>
      {users && users.length > 0 ? (
        <>
          <table ref={tableRef} className="table center">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Role</th>
                <th>User Email</th>
                {userPasswordID !== null ? (
                  <th colSpan="2">Nouveau mot de passe</th>
                ) : (
                  <>
                    <th>EDIT</th>
                    <th>PASSWORD</th>
                    <th>DELETE</th>
                    <th>DATES</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {users.map((user) => (
                <tr key={user.user_ID}>
                  {userEditId && userEditId === user.user_ID ? (
                    <>
                      <td>
                        <input
                          value={formData.user_name}
                          onChange={handleChange}
                          name="user_name"
                        ></input>
                      </td>
                      <td>
                        <select
                          defaultValue={formData.role}
                          name="role"
                          onChange={handleChange}
                        >
                          <option value="admin">Admin</option>
                          <option value="booker">Booker</option>
                          <option value="booker ext">Booker Invité</option>
                          <option value="compta">Compta</option>
                          <option value="prod">Prod</option>
                        </select>
                      </td>
                      <td>
                        <input
                          value={formData.email}
                          name="email"
                          onChange={handleChange}
                        ></input>
                      </td>
                      <td>
                        <button
                          className="btn-classique"
                          onClick={handleSubmit}
                        >
                          Confirmer
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{user.user_name}</td>
                      <td>{user.role}</td>
                      <td>{user.email}</td>
                      {userPasswordID === user.user_ID ? (
                        <>
                          <td>
                            <input
                              type="password"
                              className="form-control"
                              id="password"
                              name="password"
                              title="Le mot de passe doit contenir au moins un chiffre, une lettre majuscule, une lettre minuscule, un caractère spécial et être d'au moins 8 caractères de longueur."
                              pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$"
                              placeholder="Password"
                              value={formData.password}
                              onChange={handleChange}
                              required
                            />
                          </td>
                          <td>
                            <button
                              className="btn-classique"
                              onClick={handleSubmitPassword}
                            >
                              Confirmer
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>
                            <button
                              className="btn-classique"
                              onClick={() => handleEdit(user.user_ID)}
                            >
                              <i className="fa-regular fa-pen-to-square"></i>
                            </button>
                          </td>
                          <td>
                            <button
                              className="btn-classique"
                              onClick={() => handlePasswordChange(user.user_ID)}
                            >
                              <i className="fa-solid fa-key"></i>
                            </button>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn-classique"
                              data-bs-toggle="modal"
                              data-bs-target={`#modal-delete${user.user_ID}`}
                            >
                              <i className="fa-regular fa-trash-can fa-lg"></i>
                            </button>
                          </td>
                          <td
                            className="modal fade"
                            id={`modal-delete${user.user_ID}`}
                            tabIndex="-1"
                            aria-labelledby={`modal-delete${user.user_ID}`}
                            aria-hidden="true"
                          >
                            <div className="modal-dialog modal-dialog-centered">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h1
                                    className="modal-title fs-5"
                                    id={`modal-delete${user.user_ID}`}
                                  >
                                    Etes vous sur de vouloir supprimer{" "}
                                    {user.user_name}
                                  </h1>
                                  <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                  ></button>
                                </div>
                                <div className="modal-body">
                                  ATTENTION pour supprimer un utilisateur il
                                  faut d'abord supprimer ses dates !!!
                                </div>
                                <div className="modal-footer">
                                  <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                  >
                                    Annuler
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-danger"
                                    data-bs-dismiss="modal"
                                    onClick={() => {
                                      handleDelete(user.user_ID);
                                    }}
                                  >
                                    Supprimer
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn-classique"
                              onClick={() => handleDateByUser(user.user_ID)}
                            >
                              <i className="fa-regular fa-calendar"></i>
                            </button>
                          </td>
                        </>
                      )}
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>No users found.</p>
      )}
      {user_id !== null && <TableBooker user_id={user_id} />}
    </div>
  );
};
export default UserList;
