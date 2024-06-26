import {
    MRT_GlobalFilterTextField,
    MRT_ToggleFiltersButton,
    MRT_TablePagination,
    MRT_ToggleDensePaddingButton,
    MRT_ToggleGlobalFilterButton,
    MRT_ToggleFullScreenButton,
    MRT_ShowHideColumnsButton
} from 'material-react-table'

import Box from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import tableConfig from './tableConfig'
import Stack from '@mui/material/Stack'
import Fade from '@mui/material/Fade'
import Typography from '@mui/material/Typography'
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import React from 'react'
import { useTheme } from '@emotion/react'
import CustomTooltip from '@/components/ToolTip/CustomTooltip'
import Collapse from '@mui/material/Collapse'
import CustomHtmlTooltip from '@/components/ToolTip/CustomHtmlTooltip'
import InfoIcon from '@mui/icons-material/Info';


const tableProps = {
    getRowId: (row) => row.id,

    enableColumnOrdering: true,
    enableGrouping: true,
    enableColumnPinning: true,
    enableFacetedValues: true,
    enableRowActions: true,
    enableColumnResizing: true,
    enableStickyHeader: true,
    layoutMode: "grid-no-grow",
    paginationDisplayMode: 'pages',

    muiPaginationProps: {
        sx: {
            pd: 0,
            marginLeft: "auto"
        },
        color: 'primary',
        siblingCount: 1,
        rowsPerPageOptions: [10, 15, 20, 30, 50],
        variant: 'filled',
    },
    muiTablePaperProps: ({ table }) => ({
        elevation: 0,
        sx: (theme) => ({
            borderRadius: 0,
            transition: 'none',
            backgroundColor: table.getState().isFullScreen ? theme.palette.background.default : 'transparent',
        }),
        style: {
            overflow: "overlay",
            overflowX: "hidden",
            zIndex: table.getState().isFullScreen ? 1200 : undefined,
        },
    }),
    muiSkeletonProps: {
        animation: 'pulse',
        sx: {
            display: "none",
        }
    },
    muiTableFooterProps: {
        sx: {
            outline: "none"
        }
    },

    displayColumnDefOptions: {
        'mrt-row-actions': {
            header: 'Actions',
            visibleInShowHideMenu: false,
            enableColumnPinning: false,
            size: 80,
            maxSize: 80,
            Header: () => {
                return (
                    <span style={{ userSelect: 'none' }}>
                        Actions
                    </span>
                )
            }
        },
    },
}
const useCustomTableProps = (props = {}) => {
    const theme = useTheme()

    const {
        setPagination,
        enableSelection,
        enableColumnFilterModes,
        mini,
        disableTopToolbar,
        disableBottomToolbar,
        createTitle = 'Create New Record',
        toEdit = () => { console.log('Edit not implemented') },
        toDelete = () => { console.log('Delete not implemented') },
        toCreate = () => { console.log('Create not implemented') },
    } = props

    let fontScale = mini ? .9 : 1
    let scale = mini ? .8 : 1
    let iconScale = mini ? 1.1 : 1.2

    const muiTableBodyProps = ({ table }) => ({
        ...(table.getState().noRow && !table.getState().isLoading && {
            sx: {
                left: 0,
                bottom: 0,
                height: 1,
                width: 1,
                position: "absolute",
            },
        })
    })

    const muiSearchTextFieldProps = () => ({
        variant: 'outlined',
        placeholder: 'Search...',
        sx: {
            marginTop: -1,
            width: mini ? 250 : 300,
        },
        InputProps: {
            sx: {
                '& >.MuiInputBase-input': {
                    paddingLeft: `${iconScale * tableConfig.iconButtonSize}px`,
                },
                height: iconScale * tableConfig.iconButtonSize,
                maxHeight: iconScale * tableConfig.iconButtonSize,
                fontSize: 14 * fontScale,
                borderRadius: 100,
            },
            startAdornment: null,
        }
    })


    const muiTableBodyRowProps = ({ row }) => ({
        ...(enableSelection && {
            onClick: row.getToggleSelectedHandler(),
        }),
    })

    const muiTableContainerProps = ({ table }) => {
        return ({
            sx: {
                overflow: table.getState().noRow || table.getState().isLoading ? 'hidden' : 'overlay',
                scrollbarGutter: 'stable',
                minHeight: 300,
                ...mini && { height: 600, maxHeight: 600 },

                "&>.MuiBox-root": {
                    position: 'absolute',
                    height: 1,
                    width: 1,
                    backgroundColor: 'transparent',
                    top: 0,
                    left: 0,
                },
                '&>.MuiTable-root .norecord': {
                    height: '80vh',
                    position: 'absolute',
                    top: 0,
                },

                ...((table.getState().noRecord || table.getState().noRow) && table.getState().columnFilters.length > 0 && {
                    '&>.MuiTable-root:has(.norecord)': {
                        '&>thead': {
                            '&>tr': {
                                width: 1,
                                overflowX: "overlay",
                                scrollbarWidth: 'none',
                                scrollbarGutter: 'stable',
                            },
                        },
                    },
                }),

                '&>.MuiTable-root': {
                    '&>thead': {
                        '&>tr': {
                            borderBottom: 1,
                            borderColor: theme.palette.border.main,
                            ...(table.getState().noRecord && !table.getState().columnFilters.length > 0 && {
                                pointerEvents: 'none',
                                opacity: 0,
                                borderColor: 'transparent',
                            }),
                            boxShadow: "none",
                            transitionProperty: 'border-color opacity',
                            transitionDuration: '300ms',
                            backgroundColor: `transparent !important`,
                            '&>th:first-of-type': {
                                ...(mini && { pl: 0, }),
                            },
                            '&>th[data-pinned]': {
                                alignItems: 'center',
                                justifyContent: 'center',
                            },
                            '&>th': {
                                fontSize: theme.typography.fontSize * fontScale,
                                overflow: "hidden",
                                pb: ".5rem",
                                ...(mini && { py: .5, px: 2 }),
                                textTransform: "capitalize",
                                border: 'none !important',
                                backgroundColor: theme.palette.background.default,

                                "&::before": {
                                    display: 'none',
                                },
                                "& .Mui-TableHeadCell-ResizeHandle-Wrapper": {
                                    position: 'absolute',
                                    right: 0,
                                },
                                '& > .MuiCollapse-root': {
                                    width: "100%",
                                },

                                '& > .Mui-TableHeadCell-Content': {
                                    '& > .Mui-TableHeadCell-Content-Labels': {
                                        '& > .MuiBadge-root': {
                                            '& .MuiButtonBase-root.Mui-active:not(:has(.MuiSvgIcon-root[data-testid="SyncAltIcon"]))': {
                                                opacity: 1,
                                            },
                                            '& .MuiButtonBase-root.Mui-active:has(.MuiSvgIcon-root[data-testid="SyncAltIcon"])': {
                                                opacity: 0,
                                                transition: 'opacity 300ms',
                                            }
                                        }
                                    },
                                    '& > .Mui-TableHeadCell-Content-Actions': {
                                        opacity: 0,
                                        transitionProperty: 'opacity',
                                        transitionDuration: '300ms',
                                    },
                                },
                                '&:hover': {
                                    '& > .Mui-TableHeadCell-Content': {
                                        '& > .Mui-TableHeadCell-Content-Labels > .MuiBadge-root > .MuiButtonBase-root.Mui-active:has(.MuiSvgIcon-root[data-testid="SyncAltIcon"])': {
                                            opacity: 1,
                                        },

                                        '& > .Mui-TableHeadCell-Content-Actions': {
                                            opacity: 1,
                                        },
                                    },
                                },
                            },
                            '&>th:last-child': {
                                '& > .Mui-TableHeadCell-Content': {
                                    width: "auto",
                                },
                            }
                        }
                    },
                    '&>tbody:has(.norecord)': {
                        display: 'flex',
                        position: 'absolute',
                        top: 0,
                    },
                    '&>tbody:not(:has(.norecord))': {
                        opacity: table.getState().noRow ? 0 : 1,
                        '&>tr': {
                            '&>td': {
                                ...(mini && { py: .5, px: 2 }),
                            },
                            '&>td:first-of-type': {
                                ...(mini && { pl: '0px !important', }),
                            },
                        },
                    },
                    '&>tbody': {
                        transitionProperty: 'opacity',
                        transitionDelay: '100ms',
                        transitionDuration: '300ms',

                        '&>tr': {
                            '&:not(.Mui-selected)': {
                                py: .25,
                                '&:not(:hover)': {
                                    '&>td': {
                                        backgroundColor: `${theme.palette.background.default} !important`,
                                    },
                                },
                            },
                            backgroundColor: `transparent !important`,
                            '&>td': {
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                border: "none",
                                boxShadow: "none",
                                backgroundColor: `${theme.palette.background.default} !important`,
                                "&::before": {
                                    display: 'none',
                                },
                                ...(!enableSelection && {
                                    "&::after": {
                                        display: 'none',
                                    },
                                }),
                            },
                            ...(enableSelection && {
                                cursor: 'pointer',
                            }),
                        }
                    }
                }
            }
        })
    }

    const renderEmptyRowsFallback = ({ table }) => (
        <Fade in={table.getState().noRow} style={{ transitionDelay: '200ms' }} timeout={300} mountOnEnter unmountOnExit>
            <Stack sx={{
                width: 1,
                height: 1,
                userSelect: 'none',
                justifyContent: "center",
                alignItems: 'center',
                gap: 2,
            }}>
                <Typography variant="body" fontStyle="italic" align="center" color="textSecondary">
                    No record to display
                </Typography>
            </Stack>
        </Fade>
    )

    const renderRowActionMenuItems = ({ row }) => [
        <MenuItem key="edit" onClick={() => toEdit(row.original)}>
            <ListItemIcon>
                <EditIcon color='primary' />
            </ListItemIcon>
            <ListItemText primary="Edit" />
        </MenuItem>,

        <MenuItem key="delete" onClick={() => toDelete(row.original)}>
            <ListItemIcon>
                <DeleteIcon color='error' />
            </ListItemIcon>
            <ListItemText primary="Delete" />
        </MenuItem>,
    ]

    const renderBottomToolbar = ({ table, sx, simple = false }) => {
        return (
            <Box sx={theme => ({
                position: "sticky",
                zIndex: 15,
                bottom: 0,
                height: 55,
                width: 1,
                overflowX: "overlay",
                scrollbarGutter: 'stable',
                backgroundColor: theme.palette.background.default,
            })}>
                <Box
                    sx={(theme) => ({
                        height: 1,
                        borderTop: 1,
                        borderColor: table.getState().noRecord ? 'transparent' : theme.palette.border.main,
                        overflowX: "overlay",
                        scrollbarWidth: 'none',
                        display: 'flex',
                        alignItems: "center",
                        justifyContent: 'flex-end',

                        "& > .MuiButtonBase-root": {
                            height: "fit-content",
                            paddingBlock: 0.45 * scale,
                            paddingInline: 1 * scale,
                            fontSize: 13 * fontScale,
                        },
                        "& .MuiFormLabel-root": {
                            fontSize: 14 * fontScale,
                        },
                        "& #mrt-rows-per-page": {
                            paddingLeft: 1 * scale,
                            paddingBlock: 0.5 * scale,
                            paddingBottom: 0.3 * scale,
                            fontSize: 14 * fontScale,
                        },
                        '& > .table-pagination-wrapper': {
                            flex: 1,
                            maxWidth: 1,
                            height: 1,
                            display: 'flex',
                            overflowX: 'visible',
                            position: 'relative',
                            transform: 'translateX(0)',

                            '& > .MuiTablePagination-root': {
                                transition: 'opacity 200ms',
                                ...(table.getState().noRow && {
                                    pointerEvents: 'none',
                                    opacity: 0,
                                }),
                            }
                        },

                        "& .MuiTablePagination-root": {
                            '& > .MuiPagination-root': {
                                '& > .MuiPagination-ul': {
                                    height: 1,
                                    flexWrap: 'nowrap',
                                }
                            },
                            flexWrap: 'nowrap',
                            justifyContent: "flex-end",
                            padding: 0,
                            pl: 1 * scale,
                            flexShrink: 1,
                            width: 'fit-content',
                        },
                        ...sx,
                        transform: 'translateX(0px)',
                    })}
                >
                    <Collapse orientation="horizontal" in={!Boolean(simple)} sx={theme => ({
                        width: 115 + 8 * (table.getState().totalRowCount + 1 / 10 + 1),
                        mr: "auto",
                        overflow: "hidden",
                        [theme.breakpoints.down('md')]: {
                            width: 0,
                            mr: 0,
                        },
                    })}>
                        <Stack sx={{ pl: 1, alignItems: "baseline" }}>
                            <Collapse sx={{ transitionDelay: 400 }} timeout={600} in={Boolean(table.getState().totalRowCount && table.getState().rowCount != table.getState().totalRowCount && !table.getState().isLoading)}>
                                <Box sx={{
                                    width: "fit-content",
                                    whiteSpace: "nowrap",
                                    fontSize: 10 * fontScale,
                                    opacity: .6,
                                }}>
                                    Total:
                                    <Box component='span' sx={(theme) => ({
                                        color: theme.palette.primary.main,
                                        marginLeft: 1 * scale
                                    })}>
                                        {table.getState().totalRowCount}
                                    </Box>
                                </Box>
                            </Collapse>
                            <Box sx={{
                                width: "fit-content",
                                whiteSpace: "nowrap",
                                fontSize: 13 * fontScale,
                            }}>
                                Current Record{table.getState().rowCount > 0 ? 's' : ''}:
                                <Box component='span' sx={(theme) => ({
                                    color: theme.palette.primary.main,
                                    marginLeft: 1 * scale
                                })}>
                                    {table.getState().rowCount}
                                </Box>
                            </Box>
                        </Stack>
                    </Collapse>

                    <Fade appear={simple} in={!table.getState().noRecord}>
                        <div className='table-pagination-wrapper'>
                            <Box sx={theme => ({
                                flexShrink: 0,
                                width: 30,
                                pl: 1,
                                mr: 'auto',
                                display: "flex",
                                transition: 'width 200ms',
                                alignItems: "center",
                                justifyContent: 'flex-start',
                                overflow: "hidden",
                                [theme.breakpoints.up('md')]: {
                                    width: 0,
                                }
                            })}>
                                <CustomHtmlTooltip title={
                                    <>
                                        <Box sx={{
                                            padding: 1,
                                            px: 1.5,
                                            border: 1,
                                            borderColor: 'input.border.main',
                                            borderRadius: 1,
                                            userSelect: "none",
                                        }}>
                                            <Box sx={{
                                                width: "fit-content",
                                                whiteSpace: "nowrap",
                                                fontSize: 10 * fontScale,
                                                opacity: .6,
                                            }}>
                                                Total:
                                                <Box component='span' sx={(theme) => ({
                                                    color: theme.palette.primary.main,
                                                    pl: 1 * scale
                                                })}>
                                                    {table.getState().totalRowCount}
                                                </Box>
                                            </Box>
                                            <Box sx={{
                                                width: "fit-content",
                                                whiteSpace: "nowrap",
                                                fontSize: 13 * fontScale,
                                            }}>
                                                Current Record{table.getState().rowCount > 0 ? 's' : ''}:
                                                <Box component='span' sx={(theme) => ({
                                                    color: theme.palette.primary.main,
                                                    marginLeft: 1 * scale
                                                })}>
                                                    {table.getState().rowCount}
                                                </Box>
                                            </Box>
                                        </Box>
                                    </>
                                } placement="top-start">

                                    <InfoIcon color="primary" />
                                </CustomHtmlTooltip>
                            </Box>
                            <MRT_TablePagination table={table} />
                        </div>
                    </Fade>
                </Box >
            </Box>
        )
    }

    const renderTopToolbar = React.useCallback(({ table, simple, disabled }) => {
        let tools = ([

            <Box key={1} sx={{
                minWidth: iconScale * tableConfig.iconButtonSize,
                height: iconScale * tableConfig.iconButtonSize,
                position: 'relative',
                flexShrink: 0,

                ...(simple && {
                    borderRight: 1,
                    borderColor: "input.border.main",
                })
            }}>
                <MRT_ToggleGlobalFilterButton sx={{
                    zIndex: 1,
                    position: 'absolute',
                }} table={table} />
                <Box component='span' sx={{
                    minWidth: iconScale * tableConfig.iconButtonSize,
                    height: iconScale * tableConfig.iconButtonSize,

                    '& > .MuiCollapse-root': {
                        overflow: 'hidden',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        ...(simple && {
                            '& > .MuiCollapse-wrapper > .MuiCollapse-wrapperInner': {

                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'transparent !important',
                                }
                            }
                        }),
                    },
                }}>
                    <MRT_GlobalFilterTextField table={table} />
                </Box>
            </Box>,

            <MRT_ToggleFiltersButton table={table} key={2} />,

            <MRT_ShowHideColumnsButton table={table} key={3} />,
            !mini && <MRT_ToggleDensePaddingButton table={table} key={4} />,
            <MRT_ToggleFullScreenButton table={table} key={5} />,
            <CustomTooltip title={createTitle} key={6}>
                <IconButton onClick={toCreate} disabled={disabled}
                    sx={{
                        color: "primary.main",
                    }}
                >
                    <AddCircleRoundedIcon />
                </IconButton>
            </CustomTooltip>
        ])

        if (simple)
            return tools
        return (
            <Box
                sx={{
                    //backgroundColor: lighten(theme.palette.background.default, 0.05),
                    pl: mini ? 0 : 1 * scale,
                    pb: 1,
                    pt: table.getState().isFullScreen ? 1 : 0,
                    display: 'flex',
                    alignItems: "center",
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    position: "relative",
                }}
            >
                <Box sx={(theme) => ({
                    pb: 1.5,
                    display: 'flex',
                    height: "fit-content",
                    alignItems: 'center',
                    width: 1,
                    overflow: 'overlay',
                    scrollbarWidth: 'none',
                    '& > .MuiButtonBase-root:not(:first-of-type)': {
                        marginLeft: 0.5,
                    },
                    '& > .MuiButtonBase-root': {
                        height: iconScale * tableConfig.iconButtonSize,
                        width: iconScale * tableConfig.iconButtonSize,
                        '& > .MuiSvgIcon-root ': {
                            transform: `scale(${iconScale * tableConfig.iconScale})`,
                        }
                    },
                })}>
                    {tools}
                </Box>
            </Box>
        )
    }, [mini, createTitle, toCreate])

    return {
        initialState: {
            ...props.initialState,
            columnPinning: { right: ['mrt-row-actions'] }
        },
        ...tableProps,
        ...(setPagination && {
            onPaginationChange: setPagination,
            autoResetPageIndex: false,
        }),
        ...(enableSelection && {
            enableRowSelection: true,
        }),
        enableColumnFilterModes,
        enableBottomToolbar: !disableBottomToolbar,
        enableTopToolbar: !disableTopToolbar,

        muiSearchTextFieldProps,
        muiTableBodyRowProps,
        muiTableBodyProps,
        muiTableContainerProps,
        renderEmptyRowsFallback,
        renderRowActionMenuItems,
        renderBottomToolbar,
        renderTopToolbar,
        state: {
            ...props.state,
        },
    }
}
export default useCustomTableProps
