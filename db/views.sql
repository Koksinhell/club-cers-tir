-- Vue pour joindre les utilisateurs et leurs profils
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

-- Vue pour les sujets du forum avec le nombre de réponses et le dernier message
CREATE OR REPLACE VIEW public.forum_topics_with_stats AS
SELECT
  t.id,
  t.created_at,
  t.updated_at,
  t.title,
  t.author_id,
  t.category_id,
  t.pinned,
  t.locked,
  t.views,
  p.full_name AS author_name,
  c.name AS category_name,
  COUNT(fp.id) AS post_count,
  MAX(fp.created_at) AS last_post_date
FROM public.forum_topics t
JOIN public.profiles p ON t.author_id = p.id
JOIN public.forum_categories c ON t.category_id = c.id
LEFT JOIN public.forum_posts fp ON t.id = fp.topic_id
GROUP BY t.id, p.full_name, c.name;

-- Vue pour les annonces avec les informations du vendeur
CREATE OR REPLACE VIEW public.classifieds_with_seller AS
SELECT
  c.id,
  c.created_at,
  c.updated_at,
  c.title,
  c.description,
  c.price,
  c.seller_id,
  c.category,
  c.condition,
  c.status,
  p.full_name AS seller_name,
  p.avatar_url AS seller_avatar,
  (SELECT url FROM public.classified_images ci WHERE ci.classified_id = c.id ORDER BY ci."order" LIMIT 1) AS main_image
FROM public.classifieds c
JOIN public.profiles p ON c.seller_id = p.id;

