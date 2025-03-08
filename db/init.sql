-- Création de la table des profils utilisateurs
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'news_manager', 'moderator', 'member')),
    license_number TEXT,
    membership_status TEXT DEFAULT 'pending' CHECK (membership_status IN ('active', 'pending', 'expired'))
);

-- Fonction pour créer automatiquement un profil lors de la création d'un utilisateur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour appeler la fonction lors de la création d'un utilisateur
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Fonction pour mettre à jour la date de mise à jour du profil
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour mettre à jour la date de mise à jour du profil
DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Création d'une vue pour joindre les utilisateurs et leurs profils
CREATE OR REPLACE VIEW public.users_with_profiles AS
SELECT
  u.id,
  u.email,
  u.created_at,
  p.full_name,
  p.avatar_url,
  p.role,
  p.license_number,
  p.membership_status,
  p.updated_at
FROM auth.users u
JOIN public.profiles p ON u.id = p.id;

-- Définir les politiques de sécurité Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre à tous les utilisateurs de voir leur propre profil
CREATE POLICY "Les utilisateurs peuvent voir leur propre profil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Politique pour permettre aux utilisateurs de mettre à jour leur propre profil
CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre profil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Politique pour permettre aux administrateurs de voir tous les profils
CREATE POLICY "Les administrateurs peuvent voir tous les profils"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Politique pour permettre aux administrateurs de mettre à jour tous les profils
CREATE POLICY "Les administrateurs peuvent mettre à jour tous les profils"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Politique pour permettre aux administrateurs de supprimer des profils
CREATE POLICY "Les administrateurs peuvent supprimer des profils"
  ON public.profiles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

