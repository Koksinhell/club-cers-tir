-- Insérer des catégories de forum
INSERT INTO public.forum_categories (name, description, "order")
VALUES
  ('Général', 'Discussions générales sur le club et le tir sportif', 1),
  ('IPSC', 'Discussions sur le tir sportif dynamique IPSC', 2),
  ('TSV', 'Discussions sur le Tir Sportif de Vitesse', 3),
  ('Tir de précision', 'Discussions sur le tir de précision à 10m, 25m et 50m', 4),
  ('Équipement', 'Discussions sur l''équipement de tir', 5),
  ('Compétitions', 'Informations et discussions sur les compétitions', 6),
  ('Débutants', 'Espace d''entraide pour les débutants', 7);

-- Insérer des événements à venir
INSERT INTO public.events (title, description, start_date, end_date, location, organizer_id)
VALUES
  (
    'Journée portes ouvertes',
    'Venez découvrir notre club et nos installations lors de notre journée portes ouvertes annuelle.',
    NOW() + INTERVAL '10 days',
    NOW() + INTERVAL '10 days' + INTERVAL '8 hours',
    'Stand de tir ClubCersTir',
    '00000000-0000-0000-0000-000000000000'
  ),
  (
    'Compétition IPSC régionale',
    'Compétition régionale IPSC ouverte à tous les membres du club ayant une licence en cours de validité.',
    NOW() + INTERVAL '20 days',
    NOW() + INTERVAL '20 days' + INTERVAL '10 hours',
    'Stand de tir ClubCersTir',
    '00000000-0000-0000-0000-000000000000'
  ),
  (
    'Formation sécurité pour débutants',
    'Formation obligatoire sur les règles de sécurité pour tous les nouveaux membres.',
    NOW() + INTERVAL '5 days',
    NOW() + INTERVAL '5 days' + INTERVAL '3 hours',
    'Salle de formation ClubCersTir',
    '00000000-0000-0000-0000-000000000000'
  );

-- Note: Remplacez '00000000-0000-0000-0000-000000000000' par l'ID de l'administrateur
-- une fois que vous aurez créé le premier compte administrateur.

