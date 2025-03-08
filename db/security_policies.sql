-- Activer RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classifieds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classified_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Politiques pour les profils
CREATE POLICY "Les utilisateurs peuvent voir leur propre profil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre profil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Les administrateurs peuvent voir tous les profils"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Les administrateurs peuvent mettre à jour tous les profils"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Politiques pour les actualités
CREATE POLICY "Tout le monde peut voir les actualités publiées"
  ON public.news FOR SELECT
  USING (published = true);

CREATE POLICY "Les administrateurs et gestionnaires d'actualités peuvent voir toutes les actualités"
  ON public.news FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'news_manager')
    )
  );

CREATE POLICY "Les administrateurs et gestionnaires d'actualités peuvent insérer des actualités"
  ON public.news FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'news_manager')
    )
  );

CREATE POLICY "Les administrateurs et gestionnaires d'actualités peuvent mettre à jour les actualités"
  ON public.news FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'news_manager')
    )
  );

CREATE POLICY "Les administrateurs et gestionnaires d'actualités peuvent supprimer des actualités"
  ON public.news FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'news_manager')
    )
  );

-- Politiques pour les catégories du forum
CREATE POLICY "Tout le monde peut voir les catégories du forum"
  ON public.forum_categories FOR SELECT
  USING (true);

CREATE POLICY "Les administrateurs et modérateurs peuvent gérer les catégories du forum"
  ON public.forum_categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'moderator')
    )
  );

-- Politiques pour les sujets du forum
CREATE POLICY "Tout le monde peut voir les sujets du forum"
  ON public.forum_topics FOR SELECT
  USING (true);

CREATE POLICY "Les utilisateurs connectés peuvent créer des sujets"
  ON public.forum_topics FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Les utilisateurs peuvent mettre à jour leurs propres sujets"
  ON public.forum_topics FOR UPDATE
  USING (author_id = auth.uid());

CREATE POLICY "Les administrateurs et modérateurs peuvent mettre à jour tous les sujets"
  ON public.forum_topics FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'moderator')
    )
  );

CREATE POLICY "Les administrateurs et modérateurs peuvent supprimer des sujets"
  ON public.forum_topics FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'moderator')
    )
  );

-- Politiques pour les messages du forum
CREATE POLICY "Tout le monde peut voir les messages du forum"
  ON public.forum_posts FOR SELECT
  USING (true);

CREATE POLICY "Les utilisateurs connectés peuvent créer des messages"
  ON public.forum_posts FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    NOT EXISTS (
      SELECT 1 FROM public.forum_topics
      WHERE id = topic_id AND locked = true
    )
  );

CREATE POLICY "Les utilisateurs peuvent mettre à jour leurs propres messages"
  ON public.forum_posts FOR UPDATE
  USING (author_id = auth.uid());

CREATE POLICY "Les administrateurs et modérateurs peuvent mettre à jour tous les messages"
  ON public.forum_posts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'moderator')
    )
  );

CREATE POLICY "Les administrateurs et modérateurs peuvent supprimer des messages"
  ON public.forum_posts FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'moderator')
    )
  );

-- Politiques pour les petites annonces
CREATE POLICY "Tout le monde peut voir les annonces actives"
  ON public.classifieds FOR SELECT
  USING (status = 'active');

CREATE POLICY "Les utilisateurs connectés peuvent créer des annonces"
  ON public.classifieds FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Les utilisateurs peuvent mettre à jour leurs propres annonces"
  ON public.classifieds FOR UPDATE
  USING (seller_id = auth.uid());

CREATE POLICY "Les administrateurs peuvent mettre à jour toutes les annonces"
  ON public.classifieds FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Les utilisateurs peuvent supprimer leurs propres annonces"
  ON public.classifieds FOR DELETE
  USING (seller_id = auth.uid());

CREATE POLICY "Les administrateurs peuvent supprimer toutes les annonces"
  ON public.classifieds FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Politiques pour les images des annonces
CREATE POLICY "Tout le monde peut voir les images des annonces"
  ON public.classified_images FOR SELECT
  USING (true);

CREATE POLICY "Les utilisateurs peuvent ajouter des images à leurs propres annonces"
  ON public.classified_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.classifieds
      WHERE id = classified_id AND seller_id = auth.uid()
    )
  );

CREATE POLICY "Les utilisateurs peuvent mettre à jour les images de leurs propres annonces"
  ON public.classified_images FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.classifieds
      WHERE id = classified_id AND seller_id = auth.uid()
    )
  );

CREATE POLICY "Les utilisateurs peuvent supprimer les images de leurs propres annonces"
  ON public.classified_images FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.classifieds
      WHERE id = classified_id AND seller_id = auth.uid()
    )
  );

CREATE POLICY "Les administrateurs peuvent gérer toutes les images des annonces"
  ON public.classified_images FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Politiques pour les événements
CREATE POLICY "Tout le monde peut voir les événements"
  ON public.events FOR SELECT
  USING (true);

CREATE POLICY "Les administrateurs peuvent gérer les événements"
  ON public.events FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

