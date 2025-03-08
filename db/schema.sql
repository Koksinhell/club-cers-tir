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

-- Création de la table des actualités
CREATE TABLE IF NOT EXISTS public.news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES public.profiles(id) NOT NULL,
    published BOOLEAN DEFAULT false,
    image_url TEXT
);

-- Création de la table des catégories du forum
CREATE TABLE IF NOT EXISTS public.forum_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    "order" INTEGER DEFAULT 0  -- Échappé avec des guillemets doubles
);

-- Création de la table des sujets du forum
CREATE TABLE IF NOT EXISTS public.forum_topics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    title TEXT NOT NULL,
    author_id UUID REFERENCES public.profiles(id) NOT NULL,
    category_id UUID REFERENCES public.forum_categories(id) NOT NULL,
    pinned BOOLEAN DEFAULT false,
    locked BOOLEAN DEFAULT false,
    views INTEGER DEFAULT 0
);

-- Création de la table des messages du forum
CREATE TABLE IF NOT EXISTS public.forum_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    content TEXT NOT NULL,
    author_id UUID REFERENCES public.profiles(id) NOT NULL,
    topic_id UUID REFERENCES public.forum_topics(id) NOT NULL
);

-- Création de la table des petites annonces
CREATE TABLE IF NOT EXISTS public.classifieds (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC NOT NULL,
    seller_id UUID REFERENCES public.profiles(id) NOT NULL,
    category TEXT NOT NULL,
    condition TEXT NOT NULL CHECK (condition IN ('new', 'like_new', 'good', 'fair', 'poor')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'expired'))
);

-- Création de la table des images des petites annonces
CREATE TABLE IF NOT EXISTS public.classified_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    classified_id UUID REFERENCES public.classifieds(id) ON DELETE CASCADE NOT NULL,
    url TEXT NOT NULL,
    "order" INTEGER DEFAULT 0  -- Échappé avec des guillemets doubles
);

-- Création de la table des événements
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT NOT NULL,
    organizer_id UUID REFERENCES public.profiles(id) NOT NULL
);

-- Fonction pour incrémenter le compteur de vues d'un sujet
CREATE OR REPLACE FUNCTION increment_topic_views(topic_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.forum_topics
  SET views = views + 1
  WHERE id = topic_id;
END;
$$ LANGUAGE plpgsql;

