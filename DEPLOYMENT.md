# Deploying Quran Sight to Vercel

## Quick Deploy

1. **Push to GitHub** (Already done ✓)
   ```bash
   git push
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository: `bilalghalib/quran-sight`

3. **Configure Environment Variables**

   In the Vercel project settings, add these environment variables:

   ```
   NEXT_PUBLIC_QURAN_API_BASE_URL=https://apis.quran.foundation/content/api/v4
   NEXT_PUBLIC_QURAN_AUTH_URL=https://oauth2.quran.foundation
   QURAN_CLIENT_ID=fcb89279-c6c6-49ce-a817-755b16b8e078
   QURAN_CLIENT_SECRET=FC~rCihFICdARlO73pzqWsGVHV
   ```

   **Important**:
   - These are production credentials from Quran Foundation
   - The `QURAN_CLIENT_SECRET` should be kept secure
   - All variables are required for the API to work

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app
   - The build takes about 2-3 minutes

5. **Done!**
   - Your app will be live at: `https://quran-sight.vercel.app` (or your custom domain)
   - Vercel automatically deploys on every push to `main`

## Project Structure

```
quran-sight/
├── app/
│   ├── api/quran/          # API routes (auth & verse)
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/
│   ├── ImprovedTextBlock.tsx    # Main visualization
│   ├── SearchDrawer.tsx         # Search results panel
│   └── VerseDetail.tsx          # Verse modal with translations
├── lib/
│   ├── arabicRoots.ts      # Root patterns & etymology
│   ├── rootForms.ts        # 265+ morphological forms
│   ├── quranApi.ts         # Client-side API
│   └── verseMapping.ts     # Verse number mapping
└── public/
    └── quran.txt           # Full Quran text (6,236 verses)
```

## Features

- ✅ Comprehensive morphological analysis (265+ forms)
- ✅ Rich etymology with letter meanings
- ✅ Word-by-word hover translations
- ✅ Full verse translations
- ✅ Distribution heatmap
- ✅ Link to Quran.com
- ✅ Auto-loads with Heart (قلب) highlighted
- ✅ OAuth2 authentication with Quran Foundation API

## Monitoring

After deployment:
- Check the Vercel dashboard for build logs
- Monitor API usage (OAuth2 tokens are cached for 1 hour)
- Check function logs if there are any issues

## Troubleshooting

If the API doesn't work after deployment:
1. Verify environment variables in Vercel dashboard
2. Check function logs in Vercel
3. Ensure Quran Foundation API credentials are valid
4. Redeploy if needed

## Custom Domain (Optional)

To add a custom domain:
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as shown by Vercel
