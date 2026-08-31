-- Demo residences for the Aurea homepage.
-- Safe to run more than once: existing titles will not be inserted again.

insert into public.properties (title, price, area, bedrooms, bathrooms, type, image_url)
select *
from (
  values
    ('Marina Horizon Residence', 895000, 128, 2, 2, '2BR', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85'),
    ('Azure Bay Residence', 1125000, 146, 2, 3, '2BR', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85'),
    ('Palm View Residence', 1450000, 182, 3, 3, '3BR', 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1400&q=85'),
    ('Harbour Grand Residence', 1780000, 210, 3, 4, '3BR', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=85'),
    ('Skyline Penthouse', 2850000, 315, 4, 4, 'Penthouse', 'https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&w=1400&q=85'),
    ('Garden Villa', 4600000, 490, 5, 5, 'Villa', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1400&q=85')
) as seed(title, price, area, bedrooms, bathrooms, type, image_url)
where not exists (
  select 1
  from public.properties as existing
  where existing.title = seed.title
);
