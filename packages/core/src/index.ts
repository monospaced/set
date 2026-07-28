import "./styles.css";

import { defineSetAlert } from "./components/alert/alert";
import { defineSetBanner } from "./components/banner/banner";
import { defineSetMenu } from "./components/menu/menu";
import { defineSetNav } from "./components/nav/nav";
import { defineSetRange } from "./components/range/range";
import { defineSetSidebar } from "./components/sidebar/sidebar";

/**
 * Defines all available Set runtime custom elements.
 *
 * Safe to call multiple times. Each component-level define function is
 * responsible for guarding its own registration.
 */
export function defineSetComponents(): void {
  defineSetAlert();
  defineSetBanner();
  defineSetMenu();
  defineSetNav();
  defineSetRange();
  defineSetSidebar();
}

export {
  buildSetAlert,
  defineSetAlert,
  renderSetAlert,
  SET_ALERT_EVENT_BEFORE_DISMISS,
  SET_ALERT_EVENT_DISMISS,
  SET_ALERT_SPEC,
  SET_ALERT_TAG_NAME,
  type SetAlertProps,
  type SetAlertSize,
} from "./components/alert/alert";
export {
  buildSetAvatar,
  getSetInitials,
  renderSetAvatar,
  SET_AVATAR_SPEC,
  type SetAvatarColor,
  type SetAvatarEntity,
  type SetAvatarProps,
  type SetAvatarSize,
} from "./components/avatar/avatar";
export {
  buildSetBadge,
  renderSetBadge,
  SET_BADGE_SPEC,
  type SetBadgeProps,
  type SetBadgeSize,
} from "./components/badge/badge";
export {
  buildSetBanner,
  defineSetBanner,
  renderSetBanner,
  SET_BANNER_EVENT_BEFORE_DISMISS,
  SET_BANNER_EVENT_DISMISS,
  SET_BANNER_SPEC,
  SET_BANNER_TAG_NAME,
  type SetBannerProps,
} from "./components/banner/banner";
export {
  buildSetBlockquote,
  renderSetBlockquote,
  SET_BLOCKQUOTE_SPEC,
  type SetBlockquoteProps,
  type SetBlockquoteSize,
} from "./components/blockquote/blockquote";
export {
  buildSetBox,
  renderSetBox,
  SET_BOX_SPEC,
  type SetBoxBackground,
  type SetBoxPadding,
  type SetBoxProps,
  type SetBoxRadius,
} from "./components/box/box";
export {
  buildSetButton,
  renderSetButton,
  SET_BUTTON_SPEC,
  type SetButtonAppearance,
  type SetButtonHasPopup,
  type SetButtonLabelVisibility,
  type SetButtonPlacement,
  type SetButtonProps,
  type SetButtonSize,
  type SetButtonTone,
  type SetButtonType,
} from "./components/button/button";
export {
  buildSetCard,
  renderSetCard,
  SET_CARD_SPEC,
  type SetCardProps,
} from "./components/card/card";
export {
  buildSetCheckbox,
  renderSetCheckbox,
  SET_CHECKBOX_SPEC,
  type SetCheckboxProps,
} from "./components/checkbox/checkbox";
export {
  buildSetContainer,
  renderSetContainer,
  SET_CONTAINER_SPEC,
  type SetContainerGutter,
  type SetContainerMaxInlineSize,
  type SetContainerProps,
} from "./components/container/container";
export {
  buildSetDetails,
  renderSetDetails,
  SET_DETAILS_SPEC,
  type SetDetailsProps,
} from "./components/details/details";
export {
  buildSetDivider,
  renderSetDivider,
  SET_DIVIDER_SPEC,
  type SetDividerOrientation,
  type SetDividerProps,
  type SetDividerTone,
} from "./components/divider/divider";
export {
  buildSetExpander,
  renderSetExpander,
  SET_EXPANDER_SPEC,
  type SetExpanderProps,
  type SetExpanderSize,
} from "./components/expander/expander";
export {
  buildSetFieldset,
  renderSetFieldset,
  SET_FIELDSET_SPEC,
  type SetFieldsetProps,
} from "./components/fieldset/fieldset";
export {
  buildSetFigure,
  renderSetFigure,
  SET_FIGURE_SPEC,
  type SetFigureProps,
} from "./components/figure/figure";
export {
  buildSetGrid,
  buildSetGridItem,
  renderSetGrid,
  renderSetGridItem,
  SET_GRID_ITEM_SPEC,
  SET_GRID_SPEC,
  type SetGridGap,
  type SetGridItemProps,
  type SetGridProps,
  type SetGridTrack,
} from "./components/grid/grid";
export {
  buildSetHeading,
  renderSetHeading,
  SET_HEADING_SPEC,
  type SetHeadingProps,
  type SetHeadingSize,
} from "./components/heading/heading";
export {
  buildSetIcon,
  renderSetIcon,
  SET_ICON_RECOMMENDED,
  SET_ICON_SPEC,
  type SetIconMirrorMode,
  type SetIconProps,
  type SetIconSize,
} from "./components/icon/icon";
export {
  buildSetImage,
  renderSetImage,
  SET_IMAGE_SPEC,
  type SetImageAspectRatio,
  type SetImageGravity,
  type SetImageProps,
  type SetImageRadius,
  type SetImageSource,
} from "./components/image/image";
export {
  buildSetInline,
  renderSetInline,
  SET_INLINE_SPEC,
  type SetInlineGap,
  type SetInlineJustify,
  type SetInlineProps,
} from "./components/inline/inline";
export {
  buildSetInput,
  renderSetInput,
  SET_INPUT_SPEC,
  type SetInputProps,
  type SetInputType,
} from "./components/input/input";
export {
  buildSetLink,
  renderSetLink,
  SET_LINK_SPEC,
  type SetLinkAppearance,
  type SetLinkCurrent,
  type SetLinkLabelVisibility,
  type SetLinkPlacement,
  type SetLinkProps,
  type SetLinkSize,
  type SetLinkTarget,
  type SetLinkTone,
} from "./components/link/link";
export {
  buildSetLogo,
  renderSetLogo,
  SET_LOGO_SPEC,
  type SetLogoProps,
  type SetLogoSize,
  type SetLogoTone,
  type SetLogoVariant,
} from "./components/logo/logo";
export {
  buildSetMenu,
  defineSetMenu,
  renderSetMenu,
  SET_MENU_EVENT_CHOOSE,
  SET_MENU_SPEC,
  SET_MENU_TAG_NAME,
  type SetMenuItem,
  type SetMenuProps,
} from "./components/menu/menu";
export {
  buildSetNav,
  defineSetNav,
  renderSetNav,
  SET_NAV_SPEC,
  SET_NAV_TAG_NAME,
  type SetNavItem,
  type SetNavProps,
} from "./components/nav/nav";
export {
  buildSetPage,
  renderSetPage,
  SET_PAGE_SPEC,
  type SetPageHeaderBorder,
  type SetPageHeaderSize,
  type SetPageProps,
  type SetPageStickyHeader,
} from "./components/page/page";
export {
  buildSetPanel,
  renderSetPanel,
  SET_PANEL_SPEC,
  type SetPanelPadding,
  type SetPanelProps,
} from "./components/panel/panel";
export {
  buildSetPattern,
  renderSetPattern,
  SET_PATTERN_SPEC,
  type SetPatternProps,
  type SetPatternSize,
  type SetPatternTone,
  type SetPatternVariant,
} from "./components/pattern/pattern";
export {
  buildSetPoster,
  renderSetPoster,
  renderSetPosterImage,
  SET_POSTER_SPEC,
  type SetPosterImageProps,
  type SetPosterMedia,
  type SetPosterProps,
  type SetPosterSurface,
} from "./components/poster/poster";
export {
  buildSetProse,
  renderSetProse,
  SET_PROSE_SPEC,
  type SetProseHangingPunctuation,
  type SetProseProps,
} from "./components/prose/prose";
export {
  buildSetRadios,
  renderSetRadios,
  SET_RADIOS_SPEC,
  type SetRadioItem,
  type SetRadiosOrientation,
  type SetRadiosProps,
} from "./components/radios/radios";
export {
  buildSetRange,
  defineSetRange,
  renderSetRange,
  SET_RANGE_SPEC,
  SET_RANGE_TAG_NAME,
  type SetRangeProps,
} from "./components/range/range";
export {
  buildSetRoot,
  renderSetRoot,
  SET_ROOT_SPEC,
  type SetAppOverscrollBehavior,
  type SetBrand,
  type SetDirection,
  type SetRootProps,
  type SetTheme,
} from "./components/root/root";
export {
  buildSetSidebar,
  defineSetSidebar,
  renderSetSidebar,
  SET_SIDEBAR_SPEC,
  SET_SIDEBAR_TAG_NAME,
  type SetSidebarAboveNotebook,
  type SetSidebarProps,
} from "./components/sidebar/sidebar";
export {
  buildSetSpinner,
  renderSetSpinner,
  SET_SPINNER_SPEC,
  type SetSpinnerProps,
  type SetSpinnerSize,
  type SetSpinnerTone,
} from "./components/spinner/spinner";
export {
  buildSetStack,
  renderSetStack,
  SET_STACK_SPEC,
  type SetStackAlign,
  type SetStackGap,
  type SetStackProps,
} from "./components/stack/stack";
export {
  buildSetSurface,
  renderSetSurface,
  SET_SURFACE_SPEC,
  type SetSurfaceProps,
  type SetSurfaceVariant,
} from "./components/surface/surface";
export {
  buildSetSwitch,
  renderSetSwitch,
  SET_SWITCH_SPEC,
  type SetSwitchProps,
} from "./components/switch/switch";
export {
  buildSetText,
  renderSetText,
  SET_TEXT_SPEC,
  type SetTextAs,
  type SetTextProps,
  type SetTextSize,
  type SetTextTone,
} from "./components/text/text";
export {
  buildSetTextarea,
  renderSetTextarea,
  SET_TEXTAREA_SPEC,
  type SetTextareaProps,
  type SetTextareaResize,
} from "./components/textarea/textarea";
export { serializeSetNode, type SetNode } from "./helpers/node";
export type {
  SetComponentSpec,
  SetComponentSpecEvent,
  SetComponentSpecProp,
  SetSpecAttributeRule,
  SetSpecCondition,
  SetSpecContent,
  SetSpecElement,
  SetSpecOutput,
  SetSpecPropType,
  SetSpecTarget,
  SetSpecValue,
} from "./spec";
export type {
  SetAlign,
  SetControlSize,
  SetHeadingLevel,
  SetInlineSize,
  SetStatusTone,
} from "./types";
