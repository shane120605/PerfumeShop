import { useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import Icon from '../../components/common/Icon'
import { useAuth } from '../../context/AuthContext'
import { useStore } from '../../context/StoreContext'

const initials = (name) => name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

export default function A5_ManageUsersPage() {
  const { users, usersReady, deleteUser } = useStore()
  const { user: me } = useAuth()
  const [target, setTarget] = useState(null)
  const [notice, setNotice] = useState('')

  const confirmDelete = async () => {
    if (target.id === me.id) setNotice("You can't delete the account you are signed in with.")
    else {
      try { await deleteUser(target.id); setNotice('') }
      catch (err) { setNotice(err.errors?.user?.[0] || err.message) }
    }
    setTarget(null)
  }

  return (
    <AdminLayout title="Manage Users">
      <div className="page-head">
        <div><h2 className="serif">Users</h2><p className="muted">{users.length} registered users</p></div>
        <Button to="/admin/users/new" icon="plus" size="sm">Add User</Button>
      </div>
      {notice && <p className="notice notice--error" role="alert">{notice}</p>}

      {!usersReady && <p className="empty">Loading users…</p>}
      <div className="table-card">
        <table className="table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Action</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td><span className="person"><span className="avatar">{initials(u.name)}</span>{u.name}</span></td>
                <td>{u.email}</td>
                <td><Badge status={u.role} /></td>
                <td>
                  <div className="actions">
                    <Link to={`/admin/users/${u.id}/edit`} aria-label={`Edit ${u.name}`}><Icon name="edit" /></Link>
                    <button type="button" className="icon-btn icon-btn--danger" aria-label={`Delete ${u.name}`} onClick={() => setTarget(u)}><Icon name="trash" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog open={Boolean(target)} title="Delete User?" message={`Are you sure you want to delete “${target?.name}”? This action cannot be undone.`}
        confirmLabel="Delete User" onCancel={() => setTarget(null)} onConfirm={confirmDelete} />
    </AdminLayout>
  )
}
