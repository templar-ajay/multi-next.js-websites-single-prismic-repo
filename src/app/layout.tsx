import type { Metadata, ResolvingMetadata, Viewport } from "next";
import StyledComponentsRegistry from "@/lib/registry";

import "./globals.css";
import clsx from "clsx";
import { StyledBody } from "@/app/ServerSideValidation";

import { Nunito, Nunito_Sans } from "next/font/google";

import { repositoryName } from "@/prismicio";
import { PrismicPreview } from "@prismicio/next";

import { Providers } from "@/app/providers";
import { TrackingHeadScript } from "@phntms/next-gtm";
import { getSettings } from "@/app/utils";
import CookieConsentComp from "@/components/clientComponents/CookieConsentComp";

const body = Nunito_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const display = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  // console.log("settings", settings);

  const {
    meta_title,
    meta_description,
    og_image,
    block_indexing_by_search_engines,
  } = settings.data;

  return {
    title: meta_title || "Fallback Meta Title",
    description: meta_description || "Fallback description",
    openGraph: {
      images: [og_image?.url || "./fallback_image_path"],
    },
    robots: { index: block_indexing_by_search_engines == false },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  const {
    primary_color,
    secondary_color,
    bold_text_color,
    cookie_consent_content,
    cookie_and_privacy_policy_consent,
    gtm_id: GTM_ID,
  } = settings.data;
  console.log(
    "cookie and privacy policy consent",
    cookie_and_privacy_policy_consent
  );

  return (
    <html lang="en">
      <body className={clsx(body.variable, display.variable)}>
        <StyledBody bold_text_color={bold_text_color}>
          <Providers>
            <TrackingHeadScript id={GTM_ID || ""} isGTM={true} />
            <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
            {cookie_and_privacy_policy_consent !== false && (
              <CookieConsentComp
                cookie_consent_content={cookie_consent_content}
              />
            )}
          </Providers>
        </StyledBody>
        <PrismicPreview repositoryName={repositoryName} />
      </body>
    </html>
  );
}
