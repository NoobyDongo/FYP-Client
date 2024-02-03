'use client'
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React from "react"
import { useRouter } from "next/navigation"
import axios from 'axios'
import useProgress from "@/components/Progress/useProgress/useProgress"
import ProgressButton from "@/components/Progress/ProgressButton"
import toTableColumns from '@/components/Table/utils/toTableColumns';
import useProgressListener from "@/components/Progress/useProgress/useProgressListener"
import useNotification from "@/components/Notifications/useNotification"
import useForm from "@/components/Form/useForm";

export default function Home(props) {

    const { startAsync } = useProgress("signin")
    const { loading } = useProgressListener('signin')
    const { error: displayError, normal: displayNotes } = useNotification()

    const router = useRouter()

    const signin = async () => {
        validateRecord(async (formData) => {
            await startAsync(async () => {
                try {
                    const response = await axios.post('/api/login', formData)
                    console.log("Response:", response)
                    return response.data.valid
                } catch (error) {
                    displayError({ error: "Login Request Failed" })
                    // The request failed, you can handle the error here.
                    console.error(error)
                }
            }).then((valid) => {
                if (valid) {
                    displayNotes("Login Successful", "success")

                    setTimeout(() => {
                        let page = localStorage.getItem('lastVisitedPage') || "/"
                        if (page == "/signin") {
                            page = "/"
                        }
                        router.push(page)
                    }, 1000)
                } else {
                    displayError({ error: "Invalid Username or Password" })
                }
            })
        })
    }

    const inputs = React.useMemo(() => toTableColumns([
        {
            accessorKey: 'username',
            input: {
                type: "text",
                required: true,
            }
        },
        {
            accessorKey: 'password',
            input: {
                type: "password",
                required: true,
            }
        },
    ]).inputs, [])
    const [setFormData, validateRecord, form] = useForm({ inputs, disabled: loading })

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            minWidth="100vw"
            sx={(theme) => ({ backgroundColor: theme.palette.background.default })}
        >
            <Paper sx={{ minWidth: 400, minHeight: "fit-content" }}>
                <Typography sx={{ padding: 3 }} variant="h5">Sign in</Typography>
                <Divider sx={(theme) => ({ borderColor: theme.palette.background.default })} />

                <Stack gap={3} sx={{ padding: 3, height: 1 }}>
                    {form}
                    <Stack direction="row" gap={2} sx={{
                        justifyContent: "flex-end",
                        alignItems: "center",
                        marginTop: 10,
                    }}>
                        <ProgressButton id="signin" variant="outlined" onClick={signin}>Login</ProgressButton>
                    </Stack>
                </Stack>

            </Paper>
        </Box>
    )
}