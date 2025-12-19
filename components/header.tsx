"use client"

import Link from "next/link"
import Image from "next/image"
import { useTranslation } from "react-i18next";

export default function Header() {
  const { t } = useTranslation();
  return (
    <header className="p-4">
      <div className="flex space-x-6 justify-center">
        <div className="flex-none w-[80%]">
          <Link href="/" className="flex font-medium">
            <span>
              <Image className="rounded-full" src="/logo_48x48.png" alt="Logo" width={26} height={26} />
            </span>
            <span className="text-xl font-bold ml-2">{t('siteTitle')}</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
