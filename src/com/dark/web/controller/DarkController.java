package com.dark.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping
public class DarkController {

	@GetMapping
	public ModelAndView index() {
		ModelAndView view = new ModelAndView("index");
		return view;
	}

	@GetMapping("dashboard")
	public ModelAndView dashboard() {
		ModelAndView view = new ModelAndView("dashboard");
		return view;
	}

	@GetMapping("button")
	public ModelAndView button() {
		ModelAndView view = new ModelAndView("button");
		return view;
	}

	@GetMapping("blank")
	public ModelAndView blank() {
		ModelAndView view = new ModelAndView("blank");
		return view;
	}

	@GetMapping("chart")
	public ModelAndView chart() {
		ModelAndView view = new ModelAndView("chart");
		return view;
	}

	@GetMapping("element")
	public ModelAndView element() {
		ModelAndView view = new ModelAndView("element");
		return view;
	}

	@GetMapping("error")
	public ModelAndView error() {
		ModelAndView view = new ModelAndView("error");
		return view;
	}

	@GetMapping("form")
	public ModelAndView form() {
		ModelAndView view = new ModelAndView("form");
		return view;
	}

	@GetMapping("signin")
	public ModelAndView signin() {
		ModelAndView view = new ModelAndView("signin");
		return view;
	}

	@GetMapping("signup")
	public ModelAndView signup() {
		ModelAndView view = new ModelAndView("signup");
		return view;
	}

	@GetMapping("table")
	public ModelAndView table() {
		ModelAndView view = new ModelAndView("table");
		return view;
	}

	@GetMapping("typography")
	public ModelAndView typography() {
		ModelAndView view = new ModelAndView("typography");
		return view;
	}

	@GetMapping("widget")
	public ModelAndView widget() {
		ModelAndView view = new ModelAndView("widget");
		return view;
	}

	@GetMapping("grid")
	public ModelAndView grid() {
		ModelAndView view = new ModelAndView("grid");
		return view;
	}

	@GetMapping("prompt")
	public ModelAndView prompt() {
		ModelAndView view = new ModelAndView("prompt");
		return view;
	}

	@GetMapping("dialog")
	public ModelAndView dialog() {
		ModelAndView view = new ModelAndView("dialog");
		return view;
	}
	
	@GetMapping("dialog-window")
	public ModelAndView dialogWindow() {
		ModelAndView view = new ModelAndView("dialog-window");
		return view;
	}

}
