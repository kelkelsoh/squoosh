import { h, Component } from 'preact';

import * as style from './style.css';
import 'add-css:./style.css';
import { cleanSet, cleanMerge } from '../../util/clean-modify';

import type { SourceImage, OutputType } from '..';
import {
  EncoderOptions,
  EncoderState,
  ProcessorState,
  ProcessorOptions,
  encoderMap,
} from '../../feature-meta';
import {
  BannerTypeOptions,
  PastorsOptions,
  ContentTypeOptions,
  VersionOptions,
} from '../../rename-details';
import Expander from './Expander';
import Toggle from './Toggle';
import Select from './Select';
import Textbox from './Textbox';
import RangePicker from './DatePicker';
import { Options as QuantOptionsComponent } from 'features/processors/quantize/client';
import { Options as ResizeOptionsComponent } from 'features/processors/resize/client';
import { CLIIcon, SwapIcon } from 'client/lazy-app/icons';
import { typeLabel } from '../Results/style.css';

interface Props {
  index: 0 | 1;
  mobileView: boolean;
  source?: SourceImage;
  encoderState?: EncoderState;
  processorState: ProcessorState;
  onEncoderTypeChange(index: 0 | 1, newType: OutputType): void;
  onEncoderOptionsChange(index: 0 | 1, newOptions: EncoderOptions): void;
  onProcessorOptionsChange(index: 0 | 1, newOptions: ProcessorState): void;
  onCopyToOtherSideClick(index: 0 | 1): void;
  onCopyCliClick(index: 0 | 1): void;
  onDateChange(value: string): void;
  onBannerTypeChange(value: string): void;
  onPastorsChange(value: string): void;
  onContentTypeChange(value: string): void;
  onFileDetailsChange(value: string): void;
  onVersionChange(value: string): void;
}

interface State {
  supportedEncoderMap?: PartialButNotUndefined<typeof encoderMap>;
  dateState: string;
  bannerTypeState: string;
  pastorsState: string;
  contentTypeState: string;
  versionState: string;
  fileDetailsState: string;
}

type PartialButNotUndefined<T> = {
  [P in keyof T]: T[P];
};

const supportedEncoderMapP: Promise<PartialButNotUndefined<
  typeof encoderMap
>> = (async () => {
  const supportedEncoderMap: PartialButNotUndefined<typeof encoderMap> = {
    ...encoderMap,
  };

  // Filter out entries where the feature test fails
  await Promise.all(
    Object.entries(encoderMap).map(async ([encoderName, details]) => {
      if ('featureTest' in details && !(await details.featureTest())) {
        delete supportedEncoderMap[encoderName as keyof typeof encoderMap];
      }
    }),
  );

  return supportedEncoderMap;
})();

export default class Options extends Component<Props, State> {
  state: State = {
    supportedEncoderMap: undefined,
    dateState: '',
    bannerTypeState: '',
    pastorsState: '',
    contentTypeState: '',
    versionState: '',
    fileDetailsState: '',
  };

  constructor() {
    super();
    supportedEncoderMapP.then((supportedEncoderMap) =>
      this.setState({ supportedEncoderMap }),
    );
  }

  //Start of Rename listeners
  private onDateChange = (event: Event) => {
    const el = event.currentTarget as HTMLInputElement;

    this.props.onDateChange(el.value);
    this.setState({
      dateState: el.value,
    });
  };

  private onBannerTypeChange = (event: Event) => {
    const el = event.currentTarget as HTMLInputElement;

    this.props.onBannerTypeChange(el.value);
    this.setState({
      bannerTypeState: el.value,
    });
  };

  private onPastorsChange = (event: Event) => {
    const el = event.currentTarget as HTMLInputElement;

    this.props.onPastorsChange(el.value);
    this.setState({
      bannerTypeState: el.value,
    });
  };

  private onContentTypeChange = (event: Event) => {
    const el = event.currentTarget as HTMLInputElement;

    this.props.onContentTypeChange(el.value);
    this.setState({
      bannerTypeState: el.value,
    });
  };

  private onVersionChange = (event: Event) => {
    const el = event.currentTarget as HTMLInputElement;

    this.props.onVersionChange(el.value);
    this.setState({
      bannerTypeState: el.value,
    });
  };

  private onFileDetailsChange = (event: Event) => {
    const el = event.currentTarget as HTMLInputElement;

    this.props.onFileDetailsChange(el.value);
    this.setState({
      bannerTypeState: el.value,
    });
  };

  private onEncoderTypeChange = (event: Event) => {
    const el = event.currentTarget as HTMLSelectElement;

    // The select element only has values matching encoder types,
    // so 'as' is safe here.
    const type = el.value as OutputType;
    this.props.onEncoderTypeChange(this.props.index, type);
  };

  private onProcessorEnabledChange = (event: Event) => {
    const el = event.currentTarget as HTMLInputElement;
    const processor = el.name.split('.')[0] as keyof ProcessorState;

    this.props.onProcessorOptionsChange(
      this.props.index,
      cleanSet(this.props.processorState, `${processor}.enabled`, el.checked),
    );
  };

  private onQuantizerOptionsChange = (opts: ProcessorOptions['quantize']) => {
    this.props.onProcessorOptionsChange(
      this.props.index,
      cleanMerge(this.props.processorState, 'quantize', opts),
    );
  };

  private onResizeOptionsChange = (opts: ProcessorOptions['resize']) => {
    this.props.onProcessorOptionsChange(
      this.props.index,
      cleanMerge(this.props.processorState, 'resize', opts),
    );
  };

  private onEncoderOptionsChange = (newOptions: EncoderOptions) => {
    this.props.onEncoderOptionsChange(this.props.index, newOptions);
  };

  private onCopyCliClick = () => {
    this.props.onCopyCliClick(this.props.index);
  };

  private onCopyToOtherSideClick = () => {
    this.props.onCopyToOtherSideClick(this.props.index);
  };

  render(
    { source, encoderState, processorState }: Props,
    { supportedEncoderMap }: State,
  ) {
    const encoder = encoderState && encoderMap[encoderState.type];
    const EncoderOptionComponent =
      encoder && 'Options' in encoder ? encoder.Options : undefined;

    return (
      <div
        class={
          style.optionsScroller +
          ' ' +
          (encoderState ? '' : style.originalImage)
        }
      >
        <Expander>
          {!encoderState ? null : (
            <div>
              <h3 class={style.optionsTitle}>Rename</h3>

              <label class={style.sectionEnabler}>
                Date String
                <RangePicker onChange={this.onDateChange} />
              </label>

              <label class={style.sectionEnabler}>
                Banner Type
                <Select
                  // value={encoderState ? encoderState.type : 'identity'}
                  onChange={this.onBannerTypeChange}
                  name="banner_type"
                >
                  {BannerTypeOptions.map((type) => (
                    <option key={type.type} value={type.type}>
                      {type.options}
                    </option>
                  ))}
                </Select>
              </label>

              <label class={style.sectionEnabler}>
                Pastors
                <Select
                  name="pastors"
                  //value={options.color_space}
                  onChange={this.onPastorsChange}
                >
                  {PastorsOptions.map((type) => (
                    <option key={type.type} value={type.type}>
                      {type.options}
                    </option>
                  ))}
                </Select>
              </label>

              <label class={style.sectionEnabler}>
                Content Type
                <Select
                  name="content_type"
                  //value={options.color_space}
                  onChange={this.onContentTypeChange}
                >
                  {ContentTypeOptions.map((type) => (
                    <option key={type.type} value={type.type}>
                      {type.options}
                    </option>
                  ))}
                </Select>
              </label>

              <label class={style.sectionEnabler}>
                File Details
                <Textbox
                  //value={fileDetailsState}
                  onInput={this.onFileDetailsChange}
                />
              </label>

              <label class={style.sectionEnabler}>
                Version
                <Select
                  name="version"
                  //value={options.color_space}
                  onChange={this.onVersionChange}
                >
                  {VersionOptions.map((type) => (
                    <option key={type.type} value={type.type}>
                      {type.options}
                    </option>
                  ))}
                </Select>
              </label>

              <h3 class={style.optionsTitle}>
                <div class={style.titleAndButtons}>
                  Edit
                  <button
                    class={style.cliButton}
                    title="Copy npx command"
                    onClick={this.onCopyCliClick}
                  >
                    <CLIIcon />
                  </button>
                  <button
                    class={style.copyOverButton}
                    title="Copy settings to other side"
                    onClick={this.onCopyToOtherSideClick}
                  >
                    <SwapIcon />
                  </button>
                </div>
              </h3>
              <label class={style.sectionEnabler}>
                Resize
                <Toggle
                  name="resize.enable"
                  checked={!!processorState.resize.enabled}
                  onChange={this.onProcessorEnabledChange}
                />
              </label>
              <Expander>
                {processorState.resize.enabled ? (
                  <ResizeOptionsComponent
                    isVector={Boolean(source && source.vectorImage)}
                    inputWidth={source ? source.preprocessed.width : 1}
                    inputHeight={source ? source.preprocessed.height : 1}
                    options={processorState.resize}
                    onChange={this.onResizeOptionsChange}
                  />
                ) : null}
              </Expander>

              <label class={style.sectionEnabler}>
                Reduce palette
                <Toggle
                  name="quantize.enable"
                  checked={!!processorState.quantize.enabled}
                  onChange={this.onProcessorEnabledChange}
                />
              </label>
              <Expander>
                {processorState.quantize.enabled ? (
                  <QuantOptionsComponent
                    options={processorState.quantize}
                    onChange={this.onQuantizerOptionsChange}
                  />
                ) : null}
              </Expander>
            </div>
          )}
        </Expander>

        <h3 class={style.optionsTitle}>Compress</h3>

        <section class={`${style.optionOneCell} ${style.optionsSection}`}>
          {supportedEncoderMap ? (
            <Select
              value={encoderState ? encoderState.type : 'identity'}
              onChange={this.onEncoderTypeChange}
              large
            >
              <option value="identity">Original Image</option>
              {Object.entries(supportedEncoderMap).map(([type, encoder]) => (
                <option value={type}>{encoder.meta.label}</option>
              ))}
            </Select>
          ) : (
            <Select large>
              <option>Loading…</option>
            </Select>
          )}
        </section>

        <Expander>
          {EncoderOptionComponent && (
            <EncoderOptionComponent
              options={
                // Casting options, as encoderOptionsComponentMap[encodeData.type] ensures
                // the correct type, but typescript isn't smart enough.
                encoderState!.options as any
              }
              onChange={this.onEncoderOptionsChange}
            />
          )}
        </Expander>
      </div>
    );
  }
}
