/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from "react";
import Now from "@axetroy/react-now";
import { lazyload } from "react-lazyload";
import moment from "moment";

import { diffTime } from "../../lib/utils";
import "./index.css";

@lazyload({
  height: 200,
  offset: 100,
  once: true
})
class Footer extends Component {
  state = {
    created: new Date("2016-11-09 14:22:33")
  };

  render() {
    const LAST_UPDATE_TIME = new Date(+process.env.REACT_APP_PUBLISH_DATE);
    return (
      <div id="footer">
        <p>Copyright © 2017</p>
        <Now>
          {now => {
            const diff = diffTime(this.state.created)(now);
            return (
              <div>
                <p>
                  {`已运行
                  ${diff.days}天
                  ${diff.hours}时
                  ${diff.minutes}分
                  ${diff.seconds}秒
                  `}
                </p>
                <p>
                  最近更新&nbsp;
                  {moment(LAST_UPDATE_TIME).fromNow()}
                </p>
              </div>
            );
          }}
        </Now>
        <p>
          Created by{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/axetroy"
          >
            Axetroy
          </a>
        </p>
        <p>
          <a
            href="https://analytics.google.com/analytics/web/?hl=zh-CN&pli=1#report/defaultid/a98287100w144548599p149233935/"
            target="_blank"
            rel="noopener noreferrer"
          >
            站长统计
          </a>
        </p>
      </div>
    );
  }
}
export default Footer;
