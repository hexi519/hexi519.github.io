/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from "react";
import { connect } from "redux-zero/react";
import { withRouter } from "react-router-dom";
import { Spin, Tooltip, Icon, message } from "antd";
import ReactClipboard from "@axetroy/react-clipboard";
import Download from "@axetroy/react-download";

import prettyBytes from "../../lib/pretty-bytes";
import DocumentTitle from "../../component/document-title";
import Comments from "../../component/comments";
import { enableIframe } from "../../lib/utils";
import github from "../../lib/github";
import actions from "../../redux/actions";
import CONFIG from "../../config.json";

function values(obj) {
  let result = [];
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      result = result.concat([obj[key]]);
    }
  }
  return result;
}

class Gist extends Component {
  componentWillMount() {
    this.init(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProp) {
    const { id } = nextProp.match.params;
    if (id && id !== this.props.match.params.id) {
      this.init(id);
    }
  }

  async init(id) {
    if (id) {
      await [this.getGist(id)];
    }
  }

  async getGist(id) {
    let gist = {};
    try {
      const { data } = await github.gists.get({
        id,
        client_id: CONFIG.github_client_id,
        client_secret: CONFIG.github_client_secret,
        headers: {
          Accept: "application/vnd.github.v3.html"
        }
      });
      gist = data;

      for (let filename in gist.files) {
        if (gist.files.hasOwnProperty(filename)) {
          const file = gist.files[filename];
          const { data } = await github.misc.renderMarkdown({
            text: "```" + file.language + "\n" + file.content + "\n```",
            mode: "markdown",
            client_id: CONFIG.github_client_id,
            client_secret: CONFIG.github_client_secret
          });
          file.html = data;
        }
      }

      this.props.updateGist(id, gist);
    } catch (err) {
      console.error(err);
    }
    return gist;
  }

  render() {
    const { id } = this.props.match.params;
    const gist = (this.props.GIST || {})[id] || {};

    return (
      <DocumentTitle title={[gist.description, "代码片段"]}>
        <Spin spinning={!Object.keys(gist).length}>
          <div className="bg-white">
            <h2 style={{ textAlign: "center", padding: "1rem 0" }}>
              {gist.description}
              <Tooltip placement="topLeft" title="编辑此页">
                <a
                  href={`https://gist.github.com/${
                    gist.owner ? gist.owner.login : ""
                  }/${gist.id}/edit`}
                  target="_blank"
                >
                  <Icon type="edit" />
                </a>
              </Tooltip>
            </h2>
            {(values(gist.files) || []).map(file => {
              return (
                <div key={file.filename}>
                  <h3
                    style={{
                      backgroundColor: "#eaeaea",
                      padding: "0.5rem",
                      marginBottom: 0
                    }}
                  >
                    <span>
                      <Icon type="file" />
                      {file.filename}
                    </span>
                    <span
                      style={{
                        margin: "0 0.5rem"
                      }}
                    >
                      <Download
                        file={file.filename}
                        content={file.content}
                        style={{ display: "inline" }}
                      >
                        <a href="javascript:">
                          <Icon type="download" />
                          {prettyBytes(file.size || 0)}
                        </a>
                      </Download>
                    </span>
                    <span>
                      <ReactClipboard
                        style={{ cursor: "pointer" }}
                        value={file.content}
                        onSuccess={() => message.success("Copy Success!")}
                        onError={() => message.error("Copy Fail!")}
                      >
                        <Icon type="copy" />Copy
                      </ReactClipboard>
                    </span>
                  </h3>
                  <div
                    className="markdown-body"
                    style={{
                      fontSize: "1.6rem"
                    }}
                    dangerouslySetInnerHTML={{
                      __html: enableIframe(file.html)
                    }}
                  />
                </div>
              );
            })}
            <div className="comment-box">
              <Comments type="gist" gistId={this.props.match.params.id} />
            </div>
          </div>
        </Spin>
      </DocumentTitle>
    );
  }
}
export default connect(
  state => ({
    GIST: state.GIST
  }),
  actions
)(withRouter(Gist));
