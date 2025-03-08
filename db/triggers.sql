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

-- Fonction pour mettre à jour la date de mise à jour
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour mettre à jour la date de mise à jour des profils
DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger pour mettre à jour la date de mise à jour des actualités
DROP TRIGGER IF EXISTS news_updated_at ON public.news;
CREATE TRIGGER news_updated_at
  BEFORE UPDATE ON public.news
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger pour mettre à jour la date de mise à jour des sujets du forum
DROP TRIGGER IF EXISTS forum_topics_updated_at ON public.forum_topics;
CREATE TRIGGER forum_topics_updated_at
  BEFORE UPDATE ON public.forum_topics
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger pour mettre à jour la date de mise à jour des messages du forum
DROP TRIGGER IF EXISTS forum_posts_updated_at ON public.forum_posts;
CREATE TRIGGER forum_posts_updated_at
  BEFORE UPDATE ON public.forum_posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger pour mettre à jour la date de mise à jour des petites annonces
DROP TRIGGER IF EXISTS classifieds_updated_at ON public.classifieds;
CREATE TRIGGER classifieds_updated_at
  BEFORE UPDATE ON public.classifieds
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger pour mettre à jour la date de mise à jour des événements
DROP TRIGGER IF EXISTS events_updated_at ON public.events;
CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

