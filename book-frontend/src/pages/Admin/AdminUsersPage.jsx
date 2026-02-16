import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import api from "../../services/api";
import "./AdminPages.css";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [roleModal, setRoleModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users/");
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      toast.error("خطا در دریافت کاربران");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await api.post(`/users/${userId}/update-role/`, { role: newRole });
      toast.success("نقش کاربر تغییر کرد");
      fetchUsers();
      setRoleModal(false);
      setEditingUser(null);
    } catch (error) {
      toast.error("خطا در تغییر نقش");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("آیا از حذف این کاربر اطمینان دارید؟")) return;

    try {
      await api.delete(`/users/${userId}/`);
      toast.success("کاربر حذف شد");
      fetchUsers();
    } catch (error) {
      toast.error("خطا در حذف کاربر");
    }
  };

  const getRoleBadge = (role) => {
    const roles = {
      admin: { text: "مدیر", class: "badge-error" },
      seller: { text: "فروشنده", class: "badge-warning" },
      buyer: { text: "خریدار", class: "badge-success" },
    };
    return roles[role] || roles["buyer"];
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading"></div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="page-header">
          <h1>مدیریت کاربران</h1>
          <p>مشاهده و مدیریت کاربران سیستم</p>
        </div>

        <div className="admin-content">
          <div className="search-section">
            <div className="search-bar">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="جستجو بر اساس نام کاربری یا ایمیل..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>شناسه</th>
                  <th>نام کاربری</th>
                  <th>ایمیل</th>
                  <th>شماره تماس</th>
                  <th>نقش</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.phone_number || "-"}</td>
                    <td>
                      <span
                        className={`badge ${getRoleBadge(user.role).class}`}
                      >
                        {getRoleBadge(user.role).text}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setRoleModal(true);
                          }}
                          className="btn-icon edit"
                          title="تغییر نقش"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="btn-icon delete"
                          title="حذف"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {roleModal && editingUser && (
          <div className="modal-overlay" onClick={() => setRoleModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>تغییر نقش کاربر</h3>
              <p>کاربر: {editingUser.username}</p>
              <div className="role-buttons">
                <button
                  onClick={() => handleChangeRole(editingUser.id, "buyer")}
                  className="btn btn-secondary"
                >
                  خریدار
                </button>
                <button
                  onClick={() => handleChangeRole(editingUser.id, "seller")}
                  className="btn btn-secondary"
                >
                  فروشنده
                </button>
                <button
                  onClick={() => handleChangeRole(editingUser.id, "admin")}
                  className="btn btn-accent"
                >
                  مدیر
                </button>
              </div>
              <button
                onClick={() => setRoleModal(false)}
                className="btn btn-secondary"
              >
                انصراف
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
