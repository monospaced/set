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
  SET_ALERT_EVENT_BEFORE_DISMISS,
  SET_ALERT_EVENT_DISMISS,
  SET_ALERT_SPEC,
  SET_ALERT_TAG_NAME,
  type SetAlertProps,
  type SetAlertSize,
  defineSetAlert,
  renderSetAlert,
} from "./components/alert/alert";
export {
  buildSetAvatar,
  SET_AVATAR_SPEC,
  type SetAvatarColor,
  type SetAvatarEntity,
  type SetAvatarProps,
  type SetAvatarSize,
  getSetInitials,
  renderSetAvatar,
} from "./components/avatar/avatar";
export {
  buildSetBadge,
  SET_BADGE_SPEC,
  type SetBadgeProps,
  type SetBadgeSize,
  renderSetBadge,
} from "./components/badge/badge";
export {
  buildSetBanner,
  SET_BANNER_EVENT_BEFORE_DISMISS,
  SET_BANNER_EVENT_DISMISS,
  SET_BANNER_SPEC,
  SET_BANNER_TAG_NAME,
  type SetBannerProps,
  defineSetBanner,
  renderSetBanner,
} from "./components/banner/banner";
export {
  buildSetBlockquote,
  SET_BLOCKQUOTE_SPEC,
  type SetBlockquoteProps,
  type SetBlockquoteSize,
  renderSetBlockquote,
} from "./components/blockquote/blockquote";
export {
  buildSetBox,
  SET_BOX_SPEC,
  type SetBoxBackground,
  type SetBoxPadding,
  type SetBoxProps,
  type SetBoxRadius,
  renderSetBox,
} from "./components/box/box";
export {
  buildSetButton,
  SET_BUTTON_SPEC,
  type SetButtonAppearance,
  type SetButtonHasPopup,
  type SetButtonLabelVisibility,
  type SetButtonPlacement,
  type SetButtonProps,
  type SetButtonSize,
  type SetButtonTone,
  type SetButtonType,
  renderSetButton,
} from "./components/button/button";
export {
  buildSetCard,
  SET_CARD_SPEC,
  type SetCardProps,
  renderSetCard,
} from "./components/card/card";
export {
  buildSetCheckbox,
  SET_CHECKBOX_SPEC,
  type SetCheckboxProps,
  renderSetCheckbox,
} from "./components/checkbox/checkbox";
export {
  buildSetContainer,
  SET_CONTAINER_SPEC,
  type SetContainerGutter,
  type SetContainerMaxInlineSize,
  type SetContainerProps,
  renderSetContainer,
} from "./components/container/container";
export {
  buildSetDetails,
  SET_DETAILS_SPEC,
  type SetDetailsProps,
  renderSetDetails,
} from "./components/details/details";
export {
  buildSetDivider,
  SET_DIVIDER_SPEC,
  type SetDividerOrientation,
  type SetDividerProps,
  type SetDividerTone,
  renderSetDivider,
} from "./components/divider/divider";
export {
  buildSetExpander,
  SET_EXPANDER_SPEC,
  type SetExpanderProps,
  type SetExpanderSize,
  renderSetExpander,
} from "./components/expander/expander";
export {
  buildSetFieldset,
  SET_FIELDSET_SPEC,
  type SetFieldsetProps,
  renderSetFieldset,
} from "./components/fieldset/fieldset";
export {
  buildSetFigure,
  SET_FIGURE_SPEC,
  type SetFigureProps,
  renderSetFigure,
} from "./components/figure/figure";
export {
  buildSetGrid,
  buildSetGridItem,
  SET_GRID_ITEM_SPEC,
  SET_GRID_SPEC,
  type SetGridGap,
  type SetGridItemProps,
  type SetGridProps,
  type SetGridTrack,
  renderSetGrid,
  renderSetGridItem,
} from "./components/grid/grid";
export {
  buildSetHeading,
  SET_HEADING_SPEC,
  type SetHeadingProps,
  type SetHeadingSize,
  renderSetHeading,
} from "./components/heading/heading";
export {
  buildSetIcon,
  SET_ICON_RECOMMENDED,
  SET_ICON_SPEC,
  type SetIconMirrorMode,
  type SetIconProps,
  type SetIconSize,
  renderSetIcon,
} from "./components/icon/icon";
export {
  buildSetImage,
  SET_IMAGE_SPEC,
  type SetImageAspectRatio,
  type SetImageGravity,
  type SetImageProps,
  type SetImageRadius,
  type SetImageSource,
  renderSetImage,
} from "./components/image/image";
export {
  buildSetInline,
  SET_INLINE_SPEC,
  type SetInlineGap,
  type SetInlineJustify,
  type SetInlineProps,
  renderSetInline,
} from "./components/inline/inline";
export {
  buildSetInput,
  SET_INPUT_SPEC,
  type SetInputProps,
  type SetInputType,
  renderSetInput,
} from "./components/input/input";
export {
  buildSetLink,
  SET_LINK_SPEC,
  type SetLinkAppearance,
  type SetLinkCurrent,
  type SetLinkLabelVisibility,
  type SetLinkPlacement,
  type SetLinkProps,
  type SetLinkSize,
  type SetLinkTarget,
  type SetLinkTone,
  renderSetLink,
} from "./components/link/link";
export {
  buildSetLogo,
  SET_LOGO_SPEC,
  type SetLogoProps,
  type SetLogoSize,
  type SetLogoTone,
  type SetLogoVariant,
  renderSetLogo,
} from "./components/logo/logo";
export {
  buildSetMenu,
  SET_MENU_EVENT_CHOOSE,
  SET_MENU_SPEC,
  SET_MENU_TAG_NAME,
  type SetMenuItem,
  type SetMenuProps,
  defineSetMenu,
  renderSetMenu,
} from "./components/menu/menu";
export {
  buildSetNav,
  SET_NAV_SPEC,
  SET_NAV_TAG_NAME,
  type SetNavItem,
  type SetNavProps,
  defineSetNav,
  renderSetNav,
} from "./components/nav/nav";
export {
  buildSetPage,
  SET_PAGE_SPEC,
  type SetPageHeaderBorder,
  type SetPageHeaderSize,
  type SetPageProps,
  type SetPageStickyHeader,
  renderSetPage,
} from "./components/page/page";
export {
  buildSetPanel,
  SET_PANEL_SPEC,
  type SetPanelPadding,
  type SetPanelProps,
  renderSetPanel,
} from "./components/panel/panel";
export {
  buildSetPattern,
  SET_PATTERN_SPEC,
  type SetPatternProps,
  type SetPatternSize,
  type SetPatternTone,
  type SetPatternVariant,
  renderSetPattern,
} from "./components/pattern/pattern";
export {
  buildSetPoster,
  SET_POSTER_SPEC,
  type SetPosterImageProps,
  type SetPosterMedia,
  type SetPosterProps,
  type SetPosterSurface,
  renderSetPoster,
  renderSetPosterImage,
} from "./components/poster/poster";
export {
  buildSetProse,
  SET_PROSE_SPEC,
  type SetProseHangingPunctuation,
  type SetProseProps,
  renderSetProse,
} from "./components/prose/prose";
export {
  buildSetRadios,
  SET_RADIOS_SPEC,
  type SetRadioItem,
  type SetRadiosOrientation,
  type SetRadiosProps,
  renderSetRadios,
} from "./components/radios/radios";
export {
  buildSetRange,
  SET_RANGE_SPEC,
  SET_RANGE_TAG_NAME,
  type SetRangeProps,
  defineSetRange,
  renderSetRange,
} from "./components/range/range";
export {
  buildSetRoot,
  SET_ROOT_SPEC,
  type SetAppOverscrollBehavior,
  type SetBrand,
  type SetDirection,
  type SetRootProps,
  type SetTheme,
  renderSetRoot,
} from "./components/root/root";
export {
  buildSetShape,
  SET_SHAPE_SPEC,
  type SetShapeProps,
  type SetShapeSize,
  type SetShapeTone,
  type SetShapeVariant,
  renderSetShape,
} from "./components/shape/shape";
export {
  buildSetSidebar,
  SET_SIDEBAR_SPEC,
  SET_SIDEBAR_TAG_NAME,
  type SetSidebarAboveNotebook,
  type SetSidebarProps,
  defineSetSidebar,
  renderSetSidebar,
} from "./components/sidebar/sidebar";
export {
  buildSetSpinner,
  SET_SPINNER_SPEC,
  type SetSpinnerProps,
  type SetSpinnerSize,
  type SetSpinnerTone,
  renderSetSpinner,
} from "./components/spinner/spinner";
export {
  buildSetStack,
  SET_STACK_SPEC,
  type SetStackAlign,
  type SetStackGap,
  type SetStackProps,
  renderSetStack,
} from "./components/stack/stack";
export {
  buildSetSurface,
  SET_SURFACE_SPEC,
  type SetSurfaceProps,
  type SetSurfaceVariant,
  renderSetSurface,
} from "./components/surface/surface";
export {
  buildSetSwitch,
  SET_SWITCH_SPEC,
  type SetSwitchProps,
  renderSetSwitch,
} from "./components/switch/switch";
export {
  buildSetText,
  SET_TEXT_SPEC,
  type SetTextAs,
  type SetTextProps,
  type SetTextSize,
  type SetTextTone,
  renderSetText,
} from "./components/text/text";
export {
  buildSetTextarea,
  SET_TEXTAREA_SPEC,
  type SetTextareaProps,
  type SetTextareaResize,
  renderSetTextarea,
} from "./components/textarea/textarea";
export { type SetNode, serializeSetNode } from "./helpers/node";
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
