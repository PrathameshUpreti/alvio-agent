/**
 * Typography used in theme
 * @param {JsonObject} theme theme customization object
 */

import colors from '@/assets/scss/_themes-vars.module.scss'

export default function themeTypography(theme) {
    return {
        fontFamily: "'Inter', 'Roboto', sans-serif",
        h6: {
            fontWeight: 600,
            color: theme.heading,
            fontSize: '0.9375rem'
        },
        h5: {
            fontSize: '1.125rem',
            color: theme.heading,
            fontWeight: 600
        },
        h4: {
            fontSize: '1.3125rem',
            color: theme.heading,
            fontWeight: 700
        },
        h3: {
            fontSize: '1.5rem',
            color: theme.heading,
            fontWeight: 700
        },
        h2: {
            fontSize: '1.875rem',
            color: theme.heading,
            fontWeight: 700
        },
        h1: {
            fontSize: '2.25rem',
            color: theme.heading,
            fontWeight: 700,
            lineHeight: 1.2
        },
        subtitle1: {
            fontSize: '0.9375rem',
            fontWeight: 500,
            color: theme.darkTextPrimary
        },
        subtitle2: {
            fontSize: '0.875rem',
            fontWeight: 500,
            color: theme.darkTextSecondary
        },
        caption: {
            fontSize: '0.75rem',
            color: theme.darkTextSecondary,
            fontWeight: 400
        },
        body1: {
            fontSize: '0.9375rem',
            fontWeight: 400,
            lineHeight: '1.5',
            color: theme.darkTextPrimary
        },
        body2: {
            fontSize: '0.875rem',
            fontWeight: 400,
            lineHeight: '1.5',
            color: theme.darkTextSecondary
        },
        button: {
            textTransform: 'none',
            fontWeight: 600
        },
        customInput: {
            marginTop: 1,
            marginBottom: 1,
            '& > label': {
                top: 23,
                left: 0,
                color: colors.grey500,
                '&[data-shrink="false"]': {
                    top: 5
                }
            },
            '& > div > input': {
                padding: '30.5px 14px 11.5px !important'
            },
            '& legend': {
                display: 'none'
            },
            '& fieldset': {
                top: 0
            }
        },
        mainContent: {
            backgroundColor: theme.background,
            width: '100%',
            minHeight: 'calc(100vh - 88px)',
            flexGrow: 1,
            padding: '20px',
            marginTop: '88px',
            marginRight: '20px',
            borderRadius: `${theme?.customization?.borderRadius}px`
        },
        menuCaption: {
            fontSize: '0.875rem',
            fontWeight: 600,
            color: theme.heading,
            padding: '6px',
            textTransform: 'uppercase',
            marginTop: '10px'
        },
        subMenuCaption: {
            fontSize: '0.6875rem',
            fontWeight: 500,
            color: theme.darkTextSecondary,
            textTransform: 'capitalize'
        },
        commonAvatar: {
            cursor: 'pointer',
            borderRadius: '8px'
        },
        smallAvatar: {
            width: '22px',
            height: '22px',
            fontSize: '1rem'
        },
        mediumAvatar: {
            width: '34px',
            height: '34px',
            fontSize: '1.2rem'
        },
        largeAvatar: {
            width: '44px',
            height: '44px',
            fontSize: '1.5rem'
        }
    }
}
