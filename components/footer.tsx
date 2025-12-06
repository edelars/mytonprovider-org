"use client"

import Link from "next/link"
import { Github, MessageCircle, ArrowBigUp, Server } from "lucide-react"
import { useIsMobile } from "@/hooks/useIsMobile"

export default function Footer() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <footer className="py-8">

        <div className="flex w-[90%] space-x-6 my-4">
          <div className="ml-auto mr-4">
            <Link href="#" className="flex items-center text-gray-500 hover:text-gray-900">
              <ArrowBigUp className="h-4 w-4 mr-2" />
              Go up
            </Link>
          </div>
        </div>

        <div className="flex space-x-6 justify-center border-t">
          <div className="flex-none w-[80%] justify-between flex pt-8 items-center">
            <div>
              <Link href="https://github.com/igroman787/mytonprovider/blob/master/README.md" target="_blank" className="flex mb-5 items-center text-gray-500 hover:text-gray-900">
                <Server className="h-4 w-4 mr-2" />
                Become Provider
              </Link>
              {/* <br /> */}
              <Link href="https://t.me/mytonprovider_chat" target="_blank" className="flex my-2 mb-5 items-center text-gray-500 hover:text-gray-900">
                <MessageCircle className="h-4 w-4 mr-2" />
                Support chat
              </Link>
              {/* <br /> */}
              <Link href="https://github.com/dearjohndoe/mytonprovider-backend" target="_blank" className="flex my-2 items-center text-gray-500 hover:text-gray-900">
                <Github className="h-4 w-4 mr-2" />
                GitHub (backend)
              </Link>
              <Link href="https://github.com/dearjohndoe/mytonprovider-org" target="_blank" className="flex my-2 items-center text-gray-500 hover:text-gray-900">
                <Github className="h-4 w-4 mr-2" />
                GitHub (frontend)
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
            Go up
          </Link>
        </div>
      </div>
      <div className="flex justify-center border-t">
        <div className="flex-none w-[80%] flex pt-8 items-center justify-center">
          <div className="flex flex-wrap mx-6 gap-x-4 gap-y-2 justify-center text-gray-500">
            <Link href="https://github.com/igroman787/mytonprovider/blob/master/README.md" target="_blank" className="flex items-center hover:text-gray-900">
              <Server className="h-4 w-4 mr-2" />
              Become Provider
            </Link>
            <Link href="https://t.me/mytonprovider_chat" target="_blank" className="flex items-center hover:text-gray-900">
              <MessageCircle className="h-4 w-4 mr-2" />
              Support chat
            </Link>
          </div>

          <div className="flex flex-wrap mx-6 gap-x-4 gap-y-2 justify-center text-gray-500">
            <div className="flex items-center">
              <Github className="flex items-center h-4 w-4" />
            </div>
            <Link href="https://github.com/dearjohndoe/mytonprovider-backend" target="_blank" className="flex items-center hover:text-gray-900">
              Backend
            </Link>
            |
            <Link href="https://github.com/dearjohndoe/mytonprovider-org" target="_blank" className="flex items-center hover:text-gray-900">
              Frontend
            </Link>
          </div>
          <div className="flex space-x-4 mt-4">
          </div>
        </div>
      </div>
    </footer>
  )
}
