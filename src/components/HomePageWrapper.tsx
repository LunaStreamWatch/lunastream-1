"use client"

import React from "react"
import HomePage from "./HomePage"
import HomePageMobile from "./HomePageMobile"
import { useIsMobile } from "../hooks/useIsMobile"

const HomePageWrapper: React.FC = () => {
  const isMobile = useIsMobile()

  return isMobile ? <HomePageMobile /> : <HomePage />
}

export default HomePageWrapper
