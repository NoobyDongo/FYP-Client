'use client'
import Themed from "@/components/Themed"
import FadeWrapper from '@/components/FadeWrapper'

import * as React from 'react'
import useDarkMode from "@/utils/hooks/useDarkmode"
import CustomAppbar from "./appbar/CustomAppbar"
import Body from './Body'
import CustomDrawer from './drawer/CustomDrawer'
import Box from "@mui/material/Box"

import useClientLogin from "@/utils/hooks/useClientLogin"
import ProgressBar from "@/components/Progress/ProgressBar"
import Fade from "@mui/material/Fade"
import { SimplifiedNavOptions } from "./navoptions/options"
import TableWrapper from "../Table/_wrapper"
import link from "@/app/admin/link"
import { LocationProvider } from "./LocationContext"


export default function NavWrapper({ children }) {
    const [open, setOpen] = React.useState(false)
    const onDrawerOpen = () => setOpen(true)
    const onDrawerClose = () => setOpen(false)
    const { darkmode, toggleDarkMode } = useDarkMode()
    const bodyRef = React.useRef(null)
    const appbarRef = React.useRef(null)

    React.useEffect(() => {
        let resizeTimeout
        const handleResize = () => {
            if (bodyRef.current && appbarRef.current) {
                bodyRef.current.style.transition = 'none'
                appbarRef.current.style.transition = 'none'
            }
            clearTimeout(resizeTimeout)
            resizeTimeout = setTimeout(() => {
                if (bodyRef.current && appbarRef.current) {
                    bodyRef.current.style.transition = 'width 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms'
                    appbarRef.current.style.transition = 'width 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms'
                }
            }, 100)
        }

        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    const [valid, location] = useClientLogin()

    return (
        <Themed darkmode={darkmode}>

            {valid && location !== link.signin && <>
                <LocationProvider>
                    <Fade in={valid} mountOnEnter unmountOnExit>
                        <div className="sidebar">
                            <Box sx={{ zIndex: 3000, width: 1, height: 10, position: "absolute" }}>
                                <ProgressBar id={1} />
                            </Box>
                            <CustomDrawer optionLists={SimplifiedNavOptions} toggleDarkMode={toggleDarkMode} open={open} />
                        </div>
                    </Fade>

                    <Body ref={bodyRef} open={open}>
                        <CustomAppbar ref={appbarRef} open={open} onOpen={onDrawerClose} onClose={onDrawerOpen} />
                        <Box id="pageContainer" sx={{ transition: "padding 200ms", px: { xs: 2, md: 4 }, }}>
                            <FadeWrapper key={location}>
                                <TableWrapper>
                                    {children}
                                </TableWrapper>
                            </FadeWrapper>
                        </Box>
                    </Body>
                </LocationProvider>
            </>}

            {(!valid && location === link.signin) &&
                <FadeWrapper>
                    {children}
                </FadeWrapper>}

        </Themed>
    )
}