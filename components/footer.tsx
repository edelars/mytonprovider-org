"use client"

import Link from "next/link"
import { Github, MessageCircle, ArrowBigUp, Server, Globe } from "lucide-react"
import { useIsMobile } from "@/hooks/useIsMobile"
import { useTranslation } from "react-i18next"

export default function Footer() {
  const isMobile = useIsMobile();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ru" : "en";
    i18n.changeLanguage(newLang);
  };

  if (isMobile) {
    return (
      <footer className="py-8">

        <div className="flex w-[90%] space-x-6 my-4">
          <div className="ml-auto mr-4">
            <Link href="#" className="flex items-center text-gray-500 hover:text-gray-900">
              <ArrowBigUp className="h-4 w-4 mr-2" />
              {t('buttons.goUp')}
            </Link>
          </div>
        </div>

        <div className="flex space-x-6 justify-center border-t">
          <div className="flex-none w-[80%] justify-between flex pt-8 items-center">
            <div>
            <button onClick={toggleLanguage} className="flex items-center text-gray-500 hover:text-gray-900">
              <Globe className="h-4 w-4 mr-2" />
              {i18n.language === "en" ? "RU" : "EN"}
            </button>

              <Link href="https://github.com/igroman787/mytonprovider/blob/master/README.md" target="_blank" className="flex mb-5 items-center text-gray-500 hover:text-gray-900">
                <Server className="h-4 w-4 mr-2" />
                {t('footer.becomeProvider')}
              </Link>
              {/* <br /> */}
              <Link href="https://t.me/mytonprovider_chat" target="_blank" className="flex my-2 mb-5 items-center text-gray-500 hover:text-gray-900">
                <MessageCircle className="h-4 w-4 mr-2" />
                {t('footer.supportChat')}
              </Link>
              {/* <br /> */}
              <Link href="https://github.com/dearjohndoe/mytonprovider-backend" target="_blank" className="flex my-2 items-center text-gray-500 hover:text-gray-900">
                <Github className="h-4 w-4 mr-2" />
                {t('footer.githubBackend')}
              </Link>
              <Link href="https://github.com/dearjohndoe/mytonprovider-org" target="_blank" className="flex my-2 items-center text-gray-500 hover:text-gray-900">
                <Github className="h-4 w-4 mr-2" />
                {t('footer.githubFrontend')}
              </Link>
            </div>

            <div className="flex space-x-4 mt-4">
            </div>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="py-8">

      <div className="flex w-[90%] space-x-6 my-4">
        <div className="ml-auto mr-4">
            <Link href="#" className="flex items-center text-gray-500 hover:text-gray-900">
            <ArrowBigUp className="h-4 w-4 mr-2" />
              {t('buttons.goUp')}
          </Link>
        </div>
      </div>
      <div className="flex justify-center border-t">
        <div className="flex-none w-[80%] flex pt-8 items-center justify-center">
          <div className="mx-6 justify-center text-gray-500">
            <button onClick={toggleLanguage} className="flex items-center text-gray-500 hover:text-gray-900">
              <Globe className="h-4 w-4 mr-2" />
              {i18n.language === "en" ? "RU" : "EN"}
            </button>
          </div>

          <div className="flex flex-wrap mx-6 gap-x-4 gap-y-2 justify-center text-gray-500">
              <Link href="https://github.com/igroman787/mytonprovider/blob/master/README.md" target="_blank" className="flex items-center hover:text-gray-900">
              <Server className="h-4 w-4 mr-2" />
              {t('footer.becomeProvider')}
            </Link>
            <Link href="https://t.me/mytonprovider_chat" target="_blank" className="flex items-center hover:text-gray-900">
              <MessageCircle className="h-4 w-4 mr-2" />
              {t('footer.supportChat')}
            </Link>
          </div>

          <div className="flex flex-wrap mx-6 gap-x-4 gap-y-2 justify-center text-gray-500">
            <div className="flex items-center">
              <Github className="flex items-center h-4 w-4" />
            </div>
            <Link href="https://github.com/dearjohndoe/mytonprovider-backend" target="_blank" className="flex items-center hover:text-gray-900">
              {t('footer.backend')}
            </Link>
            |
            <Link href="https://github.com/dearjohndoe/mytonprovider-org" target="_blank" className="flex items-center hover:text-gray-900">
              {t('footer.frontend')}
            </Link>
          </div>
          <div className="flex space-x-4 mt-4">
          </div>
        </div>
      </div>
    </footer>
  )
}
