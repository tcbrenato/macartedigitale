-- Seed: Veronica Gwamzhi / Perazim Capital LLC. Run after 0010_profile_language.sql.
-- Unclaimed (user_id stays NULL) — auto-claims the moment someone signs up
-- with contact@perazimcapital.com, same as the original team profiles.

insert into public.profiles (
  slug, first_name, last_name, organization, title, tagline, photo_url,
  phone, phone_raw, whatsapp, email, url, address, city, country_line,
  status, language, template_id, theme_primary, theme_secondary, services, social
) values (
  'veronica-gwamzhi', 'Veronica', 'Gwamzhi', 'Perazim Capital LLC',
  'CEO / Founder',
  'Building breakthroughs in real estate investment — wholesale, fix & flip, fix-to-rent, and long-term wealth.',
  '/logoperazim.png',
  '+1 301 531 0480', '+13015310480', '13015310480', 'contact@perazimcapital.com',
  'https://perazimcapital.com', '7715 Glenarden Pkwy, Glenarden, MD 20706', 'Glenarden, MD', 'USA',
  'published', 'en', 'elegant', '#152A54', '#C9A227',
  $q$[
    {"icon":"Handshake","short":"Wholesale","desc":"Connecting off-market deals with the right buyers, fast."},
    {"icon":"Hammer","short":"Fix & Flip","desc":"Renovating undervalued properties for a strong resale return."},
    {"icon":"KeyRound","short":"Fix to Rent","desc":"Turning properties into reliable, income-generating rentals."},
    {"icon":"TrendingUp","short":"Build Wealth","desc":"Long-term strategies to grow and protect real estate wealth."}
  ]$q$::jsonb,
  '{}'::jsonb
)
on conflict (slug) do nothing;
