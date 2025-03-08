"use client"

import { useAuth } from "@/hooks/use-auth"
import { useSupabase } from "@/lib/supabase-provider"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Search, MoreHorizontal, UserPlus, RefreshCw, UserX } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default function UsersManagement() {
  const { loading: authLoading, authorized } = useAuth("admin")
  const { supabase } = useSupabase()
  const { toast } = useToast()

  const [users, setUsers] = useState<any[]>([])
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "member",
    license_number: "",
    membership_status: "pending",
  })

  useEffect(() => {
    if (authorized) {
      fetchUsers()
    }
  }, [authorized, supabase])

  useEffect(() => {
    filterUsers()
  }, [users, searchQuery, roleFilter, statusFilter])

  const fetchUsers = async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from("profiles")
        .select("*, auth_users:id(email, created_at)")
        .order("created_at", { ascending: false })

      if (error) throw error

      setUsers(data || [])
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Impossible de récupérer les utilisateurs: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = [...users]

    // Filtrer par recherche
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.auth_users?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.license_number?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filtrer par rôle
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    // Filtrer par statut d'adhésion
    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.membership_status === statusFilter)
    }

    setFilteredUsers(filtered)
  }

  const handleCreateUser = async () => {
    try {
      // Vérifier que tous les champs requis sont remplis
      if (!newUser.email || !newUser.password || !newUser.full_name) {
        toast({
          title: "Erreur",
          description: "Veuillez remplir tous les champs obligatoires",
          variant: "destructive",
        })
        return
      }

      // Créer l'utilisateur dans Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newUser.email,
        password: newUser.password,
        email_confirm: true,
        user_metadata: {
          full_name: newUser.full_name,
        },
      })

      if (authError) throw authError

      // Mettre à jour le profil avec les informations supplémentaires
      if (authData.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            full_name: newUser.full_name,
            role: newUser.role,
            license_number: newUser.license_number || null,
            membership_status: newUser.membership_status,
          })
          .eq("id", authData.user.id)

        if (profileError) throw profileError

        toast({
          title: "Succès",
          description: `L'utilisateur ${newUser.full_name} a été créé avec succès`,
        })

        // Réinitialiser le formulaire et fermer la boîte de dialogue
        setNewUser({
          email: "",
          password: "",
          full_name: "",
          role: "member",
          license_number: "",
          membership_status: "pending",
        })
        setIsCreateDialogOpen(false)

        // Rafraîchir la liste des utilisateurs
        fetchUsers()
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Impossible de créer l'utilisateur: ${error.message}`,
        variant: "destructive",
      })
    }
  }

  const handleUpdateUser = async () => {
    if (!selectedUser) return

    try {
      // Mettre à jour le profil
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: selectedUser.full_name,
          role: selectedUser.role,
          license_number: selectedUser.license_number || null,
          membership_status: selectedUser.membership_status,
        })
        .eq("id", selectedUser.id)

      if (profileError) throw profileError

      toast({
        title: "Succès",
        description: `L'utilisateur ${selectedUser.full_name} a été mis à jour avec succès`,
      })

      // Fermer la boîte de dialogue et rafraîchir la liste
      setIsEditDialogOpen(false)
      fetchUsers()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour l'utilisateur: ${error.message}`,
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      // Supprimer l'utilisateur de Auth
      const { error } = await supabase.auth.admin.deleteUser(userId)

      if (error) throw error

      toast({
        title: "Succès",
        description: `L'utilisateur a été supprimé avec succès`,
      })

      // Rafraîchir la liste des utilisateurs
      fetchUsers()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Impossible de supprimer l'utilisateur: ${error.message}`,
        variant: "destructive",
      })
    }
  }

  const handleResetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      toast({
        title: "Succès",
        description: `Un email de réinitialisation de mot de passe a été envoyé à ${email}`,
      })
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Impossible d'envoyer l'email de réinitialisation: ${error.message}`,
        variant: "destructive",
      })
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-500">Admin</Badge>
      case "news_manager":
        return <Badge className="bg-blue-500">Gestionnaire</Badge>
      case "moderator":
        return <Badge className="bg-amber-500">Modérateur</Badge>
      case "member":
        return <Badge variant="outline">Membre</Badge>
      default:
        return <Badge variant="outline">Inconnu</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Actif</Badge>
      case "pending":
        return <Badge className="bg-amber-500">En attente</Badge>
      case "expired":
        return <Badge variant="destructive">Expiré</Badge>
      default:
        return <Badge variant="outline">Inconnu</Badge>
    }
  }

  if (authLoading) {
    return <div>Chargement...</div>
  }

  if (!authorized) {
    return <div>Accès non autorisé</div>
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Gestion des utilisateurs</h2>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Nouvel utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
              <DialogDescription>
                Remplissez le formulaire ci-dessous pour créer un nouvel utilisateur.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email*
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Mot de passe*
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="full_name" className="text-right">
                  Nom complet*
                </Label>
                <Input
                  id="full_name"
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Rôle
                </Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger id="role" className="col-span-3">
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="news_manager">Gestionnaire d'actualités</SelectItem>
                    <SelectItem value="moderator">Modérateur</SelectItem>
                    <SelectItem value="member">Membre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="license_number" className="text-right">
                  N° de licence
                </Label>
                <Input
                  id="license_number"
                  value={newUser.license_number}
                  onChange={(e) => setNewUser({ ...newUser, license_number: e.target.value })}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="membership_status" className="text-right">
                  Statut
                </Label>
                <Select
                  value={newUser.membership_status}
                  onValueChange={(value) => setNewUser({ ...newUser, membership_status: value })}
                >
                  <SelectTrigger id="membership_status" className="col-span-3">
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="expired">Expiré</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="button" onClick={handleCreateUser}>
                Créer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
          <CardDescription>Filtrez la liste des utilisateurs selon différents critères</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="admin">Administrateur</SelectItem>
                <SelectItem value="news_manager">Gestionnaire d'actualités</SelectItem>
                <SelectItem value="moderator">Modérateur</SelectItem>
                <SelectItem value="member">Membre</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="expired">Expiré</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Tous les utilisateurs ({users.length})</TabsTrigger>
          <TabsTrigger value="active">
            Actifs ({users.filter((u) => u.membership_status === "active").length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            En attente ({users.filter((u) => u.membership_status === "pending").length})
          </TabsTrigger>
          <TabsTrigger value="expired">
            Expirés ({users.filter((u) => u.membership_status === "expired").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <UsersTable
            users={filteredUsers}
            loading={loading}
            onEdit={(user) => {
              setSelectedUser(user)
              setIsEditDialogOpen(true)
            }}
            onDelete={handleDeleteUser}
            onResetPassword={(email) => handleResetPassword(email)}
          />
        </TabsContent>

        <TabsContent value="active">
          <UsersTable
            users={filteredUsers.filter((u) => u.membership_status === "active")}
            loading={loading}
            onEdit={(user) => {
              setSelectedUser(user)
              setIsEditDialogOpen(true)
            }}
            onDelete={handleDeleteUser}
            onResetPassword={(email) => handleResetPassword(email)}
          />
        </TabsContent>

        <TabsContent value="pending">
          <UsersTable
            users={filteredUsers.filter((u) => u.membership_status === "pending")}
            loading={loading}
            onEdit={(user) => {
              setSelectedUser(user)
              setIsEditDialogOpen(true)
            }}
            onDelete={handleDeleteUser}
            onResetPassword={(email) => handleResetPassword(email)}
          />
        </TabsContent>

        <TabsContent value="expired">
          <UsersTable
            users={filteredUsers.filter((u) => u.membership_status === "expired")}
            loading={loading}
            onEdit={(user) => {
              setSelectedUser(user)
              setIsEditDialogOpen(true)
            }}
            onDelete={handleDeleteUser}
            onResetPassword={(email) => handleResetPassword(email)}
          />
        </TabsContent>
      </Tabs>

      {/* Boîte de dialogue d'édition */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
            <DialogDescription>Modifiez les informations de l'utilisateur ci-dessous.</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_email" className="text-right">
                  Email
                </Label>
                <Input
                  id="edit_email"
                  type="email"
                  value={selectedUser.auth_users?.email || ""}
                  className="col-span-3"
                  disabled
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_full_name" className="text-right">
                  Nom complet
                </Label>
                <Input
                  id="edit_full_name"
                  value={selectedUser.full_name || ""}
                  onChange={(e) => setSelectedUser({ ...selectedUser, full_name: e.target.value })}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_role" className="text-right">
                  Rôle
                </Label>
                <Select
                  value={selectedUser.role}
                  onValueChange={(value) => setSelectedUser({ ...selectedUser, role: value })}
                >
                  <SelectTrigger id="edit_role" className="col-span-3">
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="news_manager">Gestionnaire d'actualités</SelectItem>
                    <SelectItem value="moderator">Modérateur</SelectItem>
                    <SelectItem value="member">Membre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_license_number" className="text-right">
                  N° de licence
                </Label>
                <Input
                  id="edit_license_number"
                  value={selectedUser.license_number || ""}
                  onChange={(e) => setSelectedUser({ ...selectedUser, license_number: e.target.value })}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_membership_status" className="text-right">
                  Statut
                </Label>
                <Select
                  value={selectedUser.membership_status}
                  onValueChange={(value) => setSelectedUser({ ...selectedUser, membership_status: value })}
                >
                  <SelectTrigger id="edit_membership_status" className="col-span-3">
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="expired">Expiré</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button type="button" onClick={handleUpdateUser}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface UsersTableProps {
  users: any[]
  loading: boolean
  onEdit: (user: any) => void
  onDelete: (userId: string) => void
  onResetPassword: (email: string) => void
}

function UsersTable({ users, loading, onEdit, onDelete, onResetPassword }: UsersTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Utilisateur</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Date d'inscription</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                Chargement des utilisateurs...
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                Aucun utilisateur trouvé
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.full_name || "Sans nom"}</TableCell>
                <TableCell>{user.auth_users?.email || "Email inconnu"}</TableCell>
                <TableCell>
                  {user.role === "admin" && <Badge className="bg-red-500">Admin</Badge>}
                  {user.role === "news_manager" && <Badge className="bg-blue-500">Gestionnaire</Badge>}
                  {user.role === "moderator" && <Badge className="bg-amber-500">Modérateur</Badge>}
                  {user.role === "member" && <Badge variant="outline">Membre</Badge>}
                </TableCell>
                <TableCell>
                  {user.membership_status === "active" && <Badge className="bg-green-500">Actif</Badge>}
                  {user.membership_status === "pending" && <Badge className="bg-amber-500">En attente</Badge>}
                  {user.membership_status === "expired" && <Badge variant="destructive">Expiré</Badge>}
                </TableCell>
                <TableCell>
                  {user.auth_users?.created_at
                    ? format(new Date(user.auth_users.created_at), "dd/MM/yyyy", { locale: fr })
                    : "Inconnue"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onEdit(user)}>Modifier</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onResetPassword(user.auth_users?.email)}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Réinitialiser le mot de passe
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600" onClick={() => onDelete(user.id)}>
                        <UserX className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

